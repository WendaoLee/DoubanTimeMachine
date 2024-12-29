import { Effect, Either, Layer } from "effect";
import { getLoggerServiceLive, WinstonLogger } from "@/lib/service/logger.ts";
import { LoggerService } from "@/lib/service/logger.ts";
import { DOUBAN_GROUP_ID } from "@/lib/constants/ENVIROMENT.ts";
import { processTopicContentSnapshot, processTopicStatistcSnapshot, processUserSnapshot } from "../../database/index.ts";
import { getTopicStatisticAndContentSnapshotByTopicAPI, getUserSnapshotFeatureByGroupAPI } from "../../api/index.ts";
import { getGroupTopicsAPIResponse } from "../../api/group/index.ts";
import { mapGroupTopicAPIResponseToTopicIdLists } from "../../api/group/pure.ts";
import { TopicContentFeature } from "@/types/feature/TopicContentFeature.ts";
import { TopicStatisticFeature } from "@/types/feature/TopicStatisticFeature.ts";
import { CommentSyncQueueContext, SharedCommentSyncTaskQueue, theCommentSyncTaskQueue } from "@/lib/service/commentQueue.ts";
import { processOneTopicCommentSyncTask } from "./effect.ts";
import { fileURLToPath } from "url";
import path from "path";
import { getTargetTopicCommentsCount } from "../../database/comments/effect.ts";

const processTopicStatisticAndContentSnapshot = (topicStatisticAndContentSnapShotObject:{
    topicStatisticFeature:TopicStatisticFeature,
    topicContentFeature:TopicContentFeature
}) => {
    const {topicStatisticFeature,topicContentFeature} = topicStatisticAndContentSnapShotObject
    return Effect.Do.pipe(
        Effect.bind('topicStatisticSnapshotResult',() => processTopicStatistcSnapshot(topicStatisticFeature)),
        Effect.bind('topicContentSnapshotResult',() => processTopicContentSnapshot(topicContentFeature)),
        Effect.bind('commentsCount',() => getTargetTopicCommentsCount(topicContentFeature.topic_id)),
        Effect.map(({topicStatisticSnapshotResult,topicContentSnapshotResult,commentsCount}) => ({
            topicStatisticSnapshotResult,
            topicContentSnapshotResult,
            commentsCount
        }))
    )
}

const buildCommentSyncTask = (topicId:string,databaseStoredReplyCount:number,targetReplyCount:number) => {
    return {
        topicId,
        databaseStoredReplyCount,
        targetReplyCount
    }
}

/**
 * 基本元数据获取周期的逻辑封装
 */
export const actionForMetadataPeriod = Effect.gen(function*(){
    const loggerSerivceObj = yield* LoggerService
    const commentSyncQueue = yield* CommentSyncQueueContext
    const GROUP_ID = DOUBAN_GROUP_ID

    /**
     * 1. 从 /group/${groupId}/topics 获取到小组中的帖子数据，之后根据该响应构建用户快照特征
     * 2. 获取帖子 id 列表
     * 3. 根据帖子 id 列表，通过 /group/topic/${topicId} 构建帖子统计数据快照特征 与 帖子内容特征，并进行存储
     * 4. 将存储成功的帖子列表，构建评论数据同步任务队列
     */
    const syncPipeline = Effect.Do.pipe(
        Effect.bind('groupTopicAPIResponse',() => getGroupTopicsAPIResponse(GROUP_ID)),
        Effect.tap(({groupTopicAPIResponse}) => {
            loggerSerivceObj.infoLog(`成功从豆瓣小组 ${GROUP_ID} 中获取到 ${groupTopicAPIResponse.topics.length} 个帖子`)
            loggerSerivceObj.debugLog(`成功从豆瓣小组 ${GROUP_ID} 中获取到 ${groupTopicAPIResponse.topics.length} 个帖子;数据为：${JSON.stringify(groupTopicAPIResponse.topics)}`)
        }),
        Effect.let('topicIdLists',({groupTopicAPIResponse}) => mapGroupTopicAPIResponseToTopicIdLists(groupTopicAPIResponse)),
        Effect.tap(({topicIdLists}) => {
            loggerSerivceObj.debugLog(`帖子 Id 列表：${JSON.stringify(topicIdLists)}`)
        }),
        Effect.bind('userSnapshotFeature',() => getUserSnapshotFeatureByGroupAPI(GROUP_ID)),
        Effect.bind('processUserSnapShotEithers',({userSnapshotFeature}) => Effect.all(userSnapshotFeature.map(processUserSnapshot),{mode:'either'})),
        Effect.tap(({processUserSnapShotEithers,userSnapshotFeature}) => {
            /**
             * 将关于存储用户快照时发生的数据库的中间错误信息记录到日志中
             */
            processUserSnapShotEithers.forEach((oneResult,index) => {
                if(Either.isLeft(oneResult)){
                    loggerSerivceObj.errorLog(`在同步Id为 ${userSnapshotFeature[index].douban_id} 的用户数据时发生了错误;错误信息为：${oneResult.left.message}`)
                }
            })
        }),
        Effect.bind('topicStatisticAndContentSnapShotList',({topicIdLists}) => Effect.all(topicIdLists.map(getTopicStatisticAndContentSnapshotByTopicAPI),{mode:'either'})),
        Effect.tap(({topicStatisticAndContentSnapShotList,topicIdLists}) => {
            /**
             * 将从豆瓣的其他 API 中获取到的错误信息记录到日志中
             */
            topicStatisticAndContentSnapShotList.forEach((oneResult,index) => {
                if(Either.isLeft(oneResult)){
                    loggerSerivceObj.errorLog(`在同步Id为 ${topicIdLists[index]} 的帖子数据时发生了错误;错误信息为：${oneResult.left.message}`)
                }
            })
        }),
        Effect.bind('processTopicStatisticAndContentSnapshotListResult',({topicStatisticAndContentSnapShotList}) =>
             Effect.all(topicStatisticAndContentSnapShotList
                .map(Either.getOrNull)
                .filter(ele => ele !== null)
                .map(processTopicStatisticAndContentSnapshot),{mode:'either'})),
        Effect.tap(({processTopicStatisticAndContentSnapshotListResult,topicIdLists}) => {
            /**
             * 将关于数据库的中间错误信息记录到日志中
             */
            processTopicStatisticAndContentSnapshotListResult.forEach((oneResult,index) => {
                if(Either.isLeft(oneResult)){
                    loggerSerivceObj.errorLog(`在同步Id为 ${topicIdLists[index]} 的帖子数据到数据库中时发生了错误;错误信息为：${oneResult.left.message} \n stack:${oneResult.left.stack}`)
                }
            })
        }),
        /**
         * @todo 优化这段代码
         */
        Effect.tap(({groupTopicAPIResponse,processTopicStatisticAndContentSnapshotListResult}) => {
            loggerSerivceObj.infoLog(`成功将小组Id为 ${GROUP_ID} 中的 ${groupTopicAPIResponse.topics.length} 个帖子的主楼用户快照与帖子统计数据快照、帖子数据快照同步到数据库中`)
            loggerSerivceObj.infoLog('正在构建评论数据同步任务队列...')

            let commentSyncTaskCount = 0
            processTopicStatisticAndContentSnapshotListResult.forEach((oneResult,index) => {
                if(Either.isRight(oneResult)){
                    const {topicStatisticSnapshotResult,commentsCount} = oneResult.right
                    const topicId = groupTopicAPIResponse.topics[index].id
                    const targetReplyCount = topicStatisticSnapshotResult.topicStatisticSnapshot.reply_count
                    const databaseStoredReplyCount = commentsCount
                    const commentSyncTask = buildCommentSyncTask(topicId,databaseStoredReplyCount,targetReplyCount)
                    Effect.runSync(commentSyncQueue.upsert(commentSyncTask))
                    commentSyncTaskCount += 1
                }
            })
            loggerSerivceObj.infoLog(`成功构建了 ${commentSyncTaskCount} 个评论数据同步任务`)
            // const test = Effect.runSync(commentSyncQueue.getAll())
            // loggerSerivceObj.debugLog(`评论数据同步任务列表：${JSON.stringify(test)}`)
        })
    )

    const syncResult = yield* Effect.either(syncPipeline)
    if(Either.isLeft(syncResult)){
        loggerSerivceObj.errorLog(`在同步豆瓣小组 ${GROUP_ID} 中的帖子数据时发生了错误;错误信息为：${syncResult.left.message}`)
    }
}).pipe(
    Effect.provide(getLoggerServiceLive({
        debug:'./logs/debug.log',
        info:'./logs/info.log',
        warn:'./logs/warn.log',
        error:'./logs/error.log'
    })),
)


/**
 * 评论数据同步周期的逻辑封装
 */
export const actionForCommentsDataSyncPeriod = Effect.gen(function*(){
    const loggerServiceObj = yield* LoggerService
    const commentSyncQueue = yield* CommentSyncQueueContext

    loggerServiceObj.infoLog('正在从评论数据同步任务队列中获取评论数据同步任务...')

    const syncPipeline = Effect.Do.pipe(
        Effect.bind('commentSyncQueueList',() => commentSyncQueue.getAll()),
        Effect.tap(({commentSyncQueueList}) => {
            loggerServiceObj.infoLog(`成功获取到 ${commentSyncQueueList.length} 个评论数据同步任务`)
            loggerServiceObj.debugLog(`评论数据同步任务列表：${JSON.stringify(commentSyncQueueList)}`)
        }),
        Effect.bind('processCommentSyncTaskEithers',({commentSyncQueueList}) => Effect.all(commentSyncQueueList.map(processOneTopicCommentSyncTask),{mode:'either'})),
        Effect.tap(({processCommentSyncTaskEithers,commentSyncQueueList}) => {
            /**
             * 将关于数据库的中间错误信息记录到日志中
             */
            processCommentSyncTaskEithers.forEach((oneResult,index) => {
                if(Either.isLeft(oneResult)){
                    loggerServiceObj.errorLog(`在同步Id为 ${commentSyncQueueList[index].topicId} 的帖子数据时发生了错误;错误信息为：${oneResult.left.message}`)
                    /**
                     * 将任务重新插入到队列中
                     */
                    commentSyncQueue.upsert(commentSyncQueueList[index])
                }
            })
            loggerServiceObj.infoLog('成功将评论数据同步任务队列中的任务同步到数据库中')
        }),
    )
    yield* Effect.either(syncPipeline)
}).pipe(
    Effect.provide(getLoggerServiceLive({
        debug:'./logs/debug.log',
        info:'./logs/info.log',
        warn:'./logs/warn.log',
        error:'./logs/error.log'
    })),
)


if(fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) || process.argv[1].includes('quokka-vscode')){
    // const result = await Effect.runPromise(actionForMetadataPeriod)
    // console.log(result)
}
