import { Effect } from "effect";
import { getLatestTopicInfo } from "@/lib/combinators/database/topic/effect.ts";
import { Topic } from "@/database/entity/Topic.ts";
import { defaultAPILogger } from "@/lib/service/logger.ts";
import { Response, Request } from "express";

type LatestTopicInfoStruct = {
    topic_id:string
    topic_title:string
    topic_author_id:string
    topic_author_uid:string
    topic_author_name:string
    topic_author_avatar:string
    topic_content:string
    topic_comments_count:number
    topic_collection_count:number
    topic_favorite_count:number
    topic_reshare_count:number
    topic_last_reply_time:Date
    topic_snapshot_at:Date
}

const mapTopicToLatestTopicInfoStruct = (topicDatabaseObject:Topic):LatestTopicInfoStruct => {
    return {
        topic_id:topicDatabaseObject.topic_id,
        topic_title:topicDatabaseObject.topic_content_snapshots[0].title,
        topic_author_id:topicDatabaseObject.topic_content_snapshots[0].author_id,
        topic_author_uid:topicDatabaseObject.topic_content_snapshots[0].author_uid,
        topic_author_name:topicDatabaseObject.topic_content_snapshots[0].metadata.author.name,
        topic_author_avatar:topicDatabaseObject.topic_content_snapshots[0].metadata.author.avatar,
        topic_content:topicDatabaseObject.topic_content_snapshots[0].content,
        topic_comments_count:topicDatabaseObject.topic_stat_snapshots[0].reply_count,
        topic_collection_count:topicDatabaseObject.topic_stat_snapshots[0].collect_count,
        topic_favorite_count:topicDatabaseObject.topic_stat_snapshots[0].favorite_count,
        topic_reshare_count:topicDatabaseObject.topic_stat_snapshots[0].reshare_count,
        topic_last_reply_time:topicDatabaseObject.last_reply_at,
        topic_snapshot_at:topicDatabaseObject.topic_content_snapshots[0].snapshot_at,
    }
}

export const getLatestTopicInfoRunnbale = Effect.gen(function*(){
    const result = yield* getLatestTopicInfo(20)
    return result.map(mapTopicToLatestTopicInfoStruct)
})

export const getLatestTopicInfoHandler = async (req:Request,res:Response) => {
    try{
        let response = {
            code:200,
            data:[] as LatestTopicInfoStruct[],
            message:''
        }
        const result = await Effect.runPromise(getLatestTopicInfoRunnbale)
            .then(res => {
                response.data = res
                return response
            })
            .catch(e => {
                defaultAPILogger.error(e)
                response.code = 400
                response.message = e instanceof Error ? e.message : 'Unknown error'
            })

        res.status(response.code).json(response)
        return
    }catch(e){
        res.status(500).json({
            code:500,
            message:e instanceof Error ? e.message : 'Unknown error'
        })
        return
    }
}
