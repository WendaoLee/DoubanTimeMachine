import { Comments } from "@/database/entity/comments.ts";
import { TopicContentSnapshot } from "@/database/entity/TopicContentSnapshot.ts";
import { TopicStatSnapshot } from "@/database/entity/TopicStatSnapshot.ts";
import { UserSnapshot } from "@/database/entity/UserSnapshot.ts";
import { getTopicAllCommentsExtractedFeatureCollection } from "@/lib/combinators/api/index.ts";
import { getTargetTopicAllComments, getTargetTopicCommentsCount } from "@/lib/combinators/database/comments/effect.ts";
import { getTopicContentSnapshotsByTopicId, getTopicStatisticSnapshotsByTopicId } from "@/lib/combinators/database/topic/effect.ts";
import { getUserLatestSnapshotByDoubanId } from "@/lib/combinators/database/user/effect.ts";
import { Effect } from "effect";
import { Request, Response } from "express";

type TopicDetailsStruct = {
    topic_snapshots:TopicContentSnapshot[]
    topic_statistic_snapshots:TopicStatSnapshot[]
    topic_author:UserSnapshot
    comments:Comments[]
}

const getTopicDeatilsByTopicIdPipeline = (topicId:string) => Effect.gen(function*(){
    const topicSnapshots = yield* getTopicContentSnapshotsByTopicId(topicId)
    const topicStatisticSnapshots = yield* getTopicStatisticSnapshotsByTopicId(topicId)
    const topicAuthor = yield* getUserLatestSnapshotByDoubanId(topicSnapshots[0].author_id)
    const comments = yield* getTargetTopicAllComments(topicId)
    return {
        topic_snapshots:topicSnapshots,
        topic_statistic_snapshots:topicStatisticSnapshots,
        topic_author:topicAuthor,
        comments:comments
    } as TopicDetailsStruct
})

export const getTopicDeatilsByTopicIdHandler = async (req:Request,res:Response) => {
    try{
        const topicId = req.params.topicId
        let response = {
            code:200,
            data:{} as TopicDetailsStruct,
            message:''
        }
        if(!topicId){
            response.code = 400
            response.message = 'Topic ID is required'
            res.status(400).json(response)
            return
        }
        const result = await Effect.runPromise(getTopicDeatilsByTopicIdPipeline(topicId))
        response.data = result
        res.status(200).json(response)
    }catch(error){
        let response = {
            code:500,
            data:{} as TopicDetailsStruct,
            message:error instanceof Error ? error.message : 'Internal Server Error'
        }
        res.status(500).json(response)
    }
}
