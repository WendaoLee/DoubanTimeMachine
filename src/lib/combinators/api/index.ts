import { getGroupTopicsAPIResponse } from "./group/index.ts"
import { Effect } from "effect"
import { mapGroupTopicAPIResponseToUserSnapshotFeatureLists } from "./group/pure.ts"
import { fileURLToPath } from "url"
import path from "path"
import { mapTopicAPITopicInfoToTopicContentFeature } from "./topic/pure.ts"
import { mapTopicAPITopicInfoToTopicStatisticFeature } from "./topic/pure.ts"
import { fetchTopicDetail } from "./topic/index.ts"
import { fetchAllTopicComments, fetchRemainedTopicComments, fetchTopicCommentsByStartCountQuery } from "./comments/index.ts"
import { writeFileSync } from "fs"
import { UserSnapshotFeature } from "@/types/feature/UserSnapshotFeature.ts"
import { mapDoubanCommentToCommentFeature } from "./comments/pure.ts"
import { CommentFeature } from "@/types/feature/CommentFeature.ts"
import { mapDoubanCommentToUserSnapshotFeature } from "./comments/pure.ts"

/**
 * 传入 groupId ，获取用户快照特征
 * @param groupId 
 * @returns 
 */
export const getUserSnapshotFeatureByGroupAPI = (groupId:string) => Effect.Do.pipe(
    Effect.bind('groupTopics',() => getGroupTopicsAPIResponse(groupId)),
    Effect.map(({groupTopics}) => mapGroupTopicAPIResponseToUserSnapshotFeatureLists(groupTopics))
)

/**
 * 传入 topicId ，获取帖子统计快照特征与帖子内容快照特征
 * @param topicId 
 * @returns 
 */
export const getTopicStatisticAndContentSnapshotByTopicAPI = (topicId:string) => Effect.Do.pipe(
    Effect.bind('topicInfo',() => fetchTopicDetail(topicId)),
    Effect.map(({topicInfo}) => ({
        topicStatisticFeature:mapTopicAPITopicInfoToTopicStatisticFeature(topicInfo),
        topicContentFeature:mapTopicAPITopicInfoToTopicContentFeature(topicInfo)
    }))
)

/**
 * 在对一个帖子的回复数据进行处理时，能够得到的特征数据的集合
 */
export type TopicCommentsExtractedFeatureCollection = {
    authorFeature:UserSnapshotFeature
    commentFeature:CommentFeature
}

export type TopicCommentsExtractedFeatureCollectionList = TopicCommentsExtractedFeatureCollection[]

/**
 * 传入 topicId ，获取帖子的全部回复数据，并根据这部分数据去构建特征
 * @param topicId 
 * @returns 
 */
export const getTopicAllCommentsExtractedFeatureCollection = (topicId:string) => Effect.Do.pipe(
    Effect.bind('comments',() => fetchAllTopicComments(topicId)),
    Effect.map(({comments}):TopicCommentsExtractedFeatureCollectionList => comments.map(comment => ({
        authorFeature:mapDoubanCommentToUserSnapshotFeature(comment),
        commentFeature:mapDoubanCommentToCommentFeature(comment,topicId)
    })))
)

/**
 * 传入 topicId ，获取帖子的指定范围的回复数据，并根据这部分数据去构建特征
 * @param topicId 
 * @param start 
 * @param count 
 * @returns 
 */
export const getTopicRangedCommentsExtractedFeatureCollection = (topicId:string,start:number) => Effect.Do.pipe(
    Effect.bind('comments',() => fetchRemainedTopicComments(topicId,start)),
    Effect.map(({comments}):TopicCommentsExtractedFeatureCollectionList => comments.map(comment => ({
        authorFeature:mapDoubanCommentToUserSnapshotFeature(comment),
        commentFeature:mapDoubanCommentToCommentFeature(comment,topicId)
    })))
)

if(fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) || process.argv[1].includes('quokka-vscode')){
    console.warn(`正在运行单个文件的 run - test，它仅用于单独文件运行与 Quokkajs 调试。如果这是在生产环境下出现该日志，请检查是否出现了问题//文件路径:${fileURLToPath(import.meta.url)}`)
    console.time('getUserSnapshotFeatureByGroupAPI')
    // const result = await Effect.runPromise(getUserSnapshotFeatureByGroupAPI('728957'))
    // const result = await Effect.runPromise(getTopicStatisticAndContentSnapshotByTopicAPI('315206690'))
    const result = await Effect.runPromise(getTopicAllCommentsExtractedFeatureCollection('315206690'))
    console.timeEnd('getUserSnapshotFeatureByGroupAPI')
    writeFileSync('./topic_sample3.json',JSON.stringify(result,null,2))
    console.log(result)
}

