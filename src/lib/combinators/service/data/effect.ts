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

const processTopicStatisticAndContentSnapshot = (topicStatisticAndContentSnapShotObject:{
    topicStatisticFeature:TopicStatisticFeature,
    topicContentFeature:TopicContentFeature
}) => {
    const {topicStatisticFeature,topicContentFeature} = topicStatisticAndContentSnapShotObject
    return Effect.Do.pipe(
        Effect.bind('topicStatisticSnapshotResult',() => processTopicStatistcSnapshot(topicStatisticFeature)),
        Effect.bind('topicContentSnapshotResult',() => processTopicContentSnapshot(topicContentFeature)),
        Effect.map(({topicStatisticSnapshotResult,topicContentSnapshotResult}) => ({
            topicStatisticSnapshotResult,
            topicContentSnapshotResult
        }))
    )
}

/**
 * 和 `/group/${groupId}/topics` 进行交互的逻辑封装
 */
export const actionForDoubanGroudTopicAPI = Effect.gen(function*(){
    const loggerSerivceObj = yield* LoggerService
    const GROUP_ID = DOUBAN_GROUP_ID

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
             * 将关于数据库的中间错误信息记录到日志中
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
        Effect.tap(({groupTopicAPIResponse}) => {
            loggerSerivceObj.infoLog(`成功将小组Id为 ${GROUP_ID} 中的 ${groupTopicAPIResponse.topics.length} 个帖子的主楼用户快照与帖子统计数据快照、帖子数据快照同步到数据库中`)
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
    }))
)

const t = actionForDoubanGroudTopicAPI
const result = await Effect.runPromise(t)
