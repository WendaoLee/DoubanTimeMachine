import { Effect } from "effect"
import { handleTypeORMErrorWithFucInfo } from "@/types/error/TypeORMWrappedError.ts"
import { Comments } from "@/database/entity/comments.ts"
import { CommentFeature } from "@/types/feature/CommentFeature.ts"
import { GeneralContentDatasource } from "@/database/datasource.ts"
import { User } from "@/database/entity/User.ts"
import { Topic } from "@/database/entity/Topic.ts"

export const upsertReplyRecordFromCommentFeature = (commentFeature:CommentFeature) => Effect.tryPromise({
    try:async () => {
        if(!GeneralContentDatasource.isInitialized){
            await GeneralContentDatasource.initialize()
        }

        const existReply = await GeneralContentDatasource.getRepository(Comments).findOne({where:{
            comment_id:commentFeature.comment_id
        }})

        if(existReply){
            existReply.upvote_count = commentFeature.upvote_count
            existReply.metadata = commentFeature.metadata
            return await GeneralContentDatasource.getRepository(Comments).save(existReply)
        }

        const newReply = new Comments()
        newReply.comment_id = commentFeature.comment_id
        newReply.upvote_count = commentFeature.upvote_count
        newReply.content = commentFeature.content
        newReply.user =  await GeneralContentDatasource.getRepository(User).findOneByOrFail({
            douban_id:commentFeature.author.id
        })
        newReply.topic = await GeneralContentDatasource.getRepository(Topic).findOneByOrFail({
            topic_id:commentFeature.topic_id
        })
        newReply.created_at = commentFeature.created_at
        newReply.user_uid = commentFeature.author.uid
        newReply.ref_comment_id = commentFeature.ref_comment_id
        newReply.metadata = commentFeature.metadata

       return await GeneralContentDatasource.getRepository(Comments).save(newReply)
   },
    catch:handleTypeORMErrorWithFucInfo('lib.combinators.database.reply.effect.upsertReplyRecordFromCommentFeature')
})


/**
 * 获取指定话题的评论数量
 * @param topicId 话题 id
 * @returns 评论数量
 */
export const getTargetTopicCommentsCount = (topicId:string) => Effect.tryPromise({
    try:async () => {
        if(!GeneralContentDatasource.isInitialized){
            await GeneralContentDatasource.initialize()
        }
        return await GeneralContentDatasource.getRepository(Comments).count({where:{
            topic:{
                topic_id:topicId
            }
        },cache:true})
    },
    catch:handleTypeORMErrorWithFucInfo('lib.combinators.database.reply.effect.getTargetTopicCommentsCount')
})
