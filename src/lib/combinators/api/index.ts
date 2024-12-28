import { getGroupTopicsAPIResponse } from "./group/index.ts"
import { Effect } from "effect"
import { mapGroupTopicAPIResponseToUserSnapshotFeatureLists } from "./group/pure.ts"
import { fileURLToPath } from "url"
import path from "path"
import { mapTopicAPITopicInfoToTopicContentFeature } from "./topic/pure.ts"
import { mapTopicAPITopicInfoToTopicStatisticFeature } from "./topic/pure.ts"
import { fetchTopicDetail } from "./topic/index.ts"

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



if(fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) || process.argv[1].includes('quokka-vscode')){
    console.warn(`正在运行单个文件的 run - test，它仅用于单独文件运行与 Quokkajs 调试。如果这是在生产环境下出现该日志，请检查是否出现了问题//文件路径:${fileURLToPath(import.meta.url)}`)
    console.time('getUserSnapshotFeatureByGroupAPI')
    const result = await Effect.runPromise(getUserSnapshotFeatureByGroupAPI('728957'))
    console.timeEnd('getUserSnapshotFeatureByGroupAPI')
    console.log(result)
}

