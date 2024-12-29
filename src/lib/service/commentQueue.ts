import { Ref,Effect, SynchronizedRef, Layer, Context } from "effect";

export type CommentSyncTask = {
    topicId:string
    databaseStoredReplyCount:number
    targetReplyCount:number
}

class CommentSyncQueue {
    /**
     * 插入任务，如果指定任务 Id 的 task 已存在，更新相应信息。
     */
    upsert:(task:CommentSyncTask) => Effect.Effect<void>
    /**
     * 获取所有任务，并且清空队列
     */
    getAll:() => Effect.Effect<CommentSyncTask[]>

    constructor(private readonly queue:Ref.Ref<CommentSyncTask[]>) {
        this.upsert =  (task) => Ref.update(this.queue,(theQueue) => {
            const existedTask = theQueue.find(oneTask => oneTask.topicId === task.topicId)
            if(existedTask){
                const result = theQueue.splice(theQueue.indexOf(existedTask),1)
                return [...result,task]
            }
            return [...theQueue,task]
        })

        this.getAll = () => Ref.getAndSet(this.queue,[])
    }
}

export const theCommentSyncTaskQueue = Effect.andThen(
    SynchronizedRef.make<CommentSyncTask[]>([]),
    (queue) => new CommentSyncQueue(queue)
)


export class CommentSyncQueueContext extends Context.Tag<'CommentSyncQueueContext'>('CommentSyncQueueContext')<
    CommentSyncQueueContext,
    {
        readonly upsert:(task:CommentSyncTask) => Effect.Effect<void>
        readonly getAll:() => Effect.Effect<CommentSyncTask[]>
    }
>() {}



export const SharedCommentSyncTaskQueue = Layer.effect(
    CommentSyncQueueContext,
    Effect.gen(function*(){
        return yield* Effect.andThen(
            SynchronizedRef.make<CommentSyncTask[]>([]),
            (queue) => new CommentSyncQueue(queue)
        )
    })
)
