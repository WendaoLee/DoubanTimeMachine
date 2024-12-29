import { Effect, Either } from "effect"
import { CommentSyncTask } from "@/lib/service/commentQueue.ts"
import { getTopicAllCommentsExtractedFeatureCollection,getTopicRangedCommentsExtractedFeatureCollection, TopicCommentsExtractedFeatureCollection, TopicCommentsExtractedFeatureCollectionList } from "../../api/index.ts"
import { upsertUserSnapshotRecordIfNotExist } from "../../database/user/effect.ts"
import { upsertReplyRecordFromCommentFeature } from "../../database/comments/effect.ts"
import path from "path"
import { fileURLToPath } from "url"
import { cons } from "effect/List"
import { processUserSnapshot } from "../../database/index.ts"

const isIncrementalSync = (commentSyncTask:CommentSyncTask) => commentSyncTask.databaseStoredReplyCount < commentSyncTask.targetReplyCount && commentSyncTask.databaseStoredReplyCount != 0

/**
 * 根据评论数据同步任务的结构，决定是增量同步还是全量同步
 * @param commentSyncTask 
 * @returns 
 */
const routePipeByCommentSyncTask = (commentSyncTask:CommentSyncTask) => Effect.if(
    isIncrementalSync(commentSyncTask),
    {
        onTrue:() => getTopicRangedCommentsExtractedFeatureCollection(commentSyncTask.topicId,commentSyncTask.databaseStoredReplyCount - 1),
        onFalse:() => getTopicAllCommentsExtractedFeatureCollection(commentSyncTask.topicId)
    }
)

const processOneFeatureCollection = (featureCollection:TopicCommentsExtractedFeatureCollection) => Effect.Do.pipe(
    Effect.flatMap(() => processUserSnapshot(featureCollection.authorFeature)),
    Effect.flatMap(() => upsertReplyRecordFromCommentFeature(featureCollection.commentFeature))
)

/**
 * 处理单个话题的评论数据同步任务
 * @param commentSyncTask 
 * @returns 
 */
export const processOneTopicCommentSyncTask = (commentSyncTask:CommentSyncTask) => Effect.Do.pipe(
    Effect.bind('featureCollection',() => routePipeByCommentSyncTask(commentSyncTask)),
    Effect.bind('featureCollectionProcessedResultEither',({featureCollection})=>
        Effect.all(featureCollection.map(processOneFeatureCollection))
    ),
    // Effect.map(({featureCollectionProcessedResultEither,featureCollection}) => {
    //     featureCollectionProcessedResultEither.forEach((oneResult,index) => {
    //         if(Either.isLeft(oneResult)){
    //             console.error(`在同步Id为 ${commentSyncTask.topicId} 的帖子数据时发生了错误;错误信息为：${oneResult.left.message}`)
    //         }
    //     })
    // })
)

if(fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) || process.argv[1].includes('quokka-vscode')){
    const result = await Effect.runPromise(processOneTopicCommentSyncTask({topicId:'315757738',databaseStoredReplyCount:0,targetReplyCount:10}))
    console.log(result)
}