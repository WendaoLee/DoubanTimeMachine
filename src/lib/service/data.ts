import { Context, Effect, Either, Layer, Schedule } from "effect";
import { actionForCommentsDataSyncPeriod,actionForMetadataPeriod } from "../combinators/service/data/index.ts";
import { getLoggerServiceLive, LoggerService } from "./logger.ts";
import { CommentSyncQueueContext, SharedCommentSyncTaskQueue, theCommentSyncTaskQueue } from "./commentQueue.ts";

/**
 * 从豆瓣获取数据&存储数据&获取已存储的数据都通过该层进行数据的交互。
 */
export class DataService extends Context.Tag('DataService')<
    DataService,
    {
        /**
         * 在数据层启动爬虫
         * @returns 
         */
        readonly startCrawler: () => void
    }
>() {}


export const DataServiceLive = Layer.effect(
    DataService,
    Effect.gen(function*(){
        const loggerService = yield* LoggerService

        return {
            startCrawler:() => {
                loggerService.infoLog('正在启动周期同步程序中...')
                const metadataPeriodSchedule = Effect.schedule(actionForMetadataPeriod,Schedule.spaced('30 seconds'))
                const commentsDataSyncPeriodSchedule = Effect.schedule(actionForCommentsDataSyncPeriod,Schedule.spaced('1 minutes'))
                Effect.runPromise(Effect.all([metadataPeriodSchedule,commentsDataSyncPeriodSchedule],{concurrency:2}).pipe(
                    Effect.provide(SharedCommentSyncTaskQueue)
                ))
                loggerService.infoLog('周期同步程序启动成功')
            }
        }
    })
).pipe(
    Layer.provide(getLoggerServiceLive({
        debug:'./logs/debug.log',
        info:'./logs/info.log',
        warn:'./logs/warn.log',
        error:'./logs/error.log'
    }))
)
