import { DoubanComment } from "@/types/Comments.ts";
import { CommentFeature } from "@/types/feature/CommentFeature.ts";
import { UserSnapshotFeature } from "@/types/feature/UserSnapshotFeature.ts";


/**
 * 从豆瓣的回复中提取出用户快照特征
 * @param comment 
 * @returns 
 */
export const mapDoubanCommentToUserSnapshotFeature = (comment:DoubanComment):UserSnapshotFeature => {
    return {
        douban_id:comment.author.id,
        douban_uid:comment.author.id,
        name:comment.author.name,
        avatar:comment.author.avatar,
        gender:comment.author.gender,
        user_created_at:new Date(comment.author.reg_time),
        user_avatar_url:comment.author.avatar,
        location:comment.author.loc,
        metadata:comment.author
    }
}

export const mapDoubanCommentToCommentFeature = (comment:DoubanComment,topicId:string):CommentFeature => {
    return {
        _tag_:"comment_feature",
        topic_id:topicId,
        comment_id:comment.id,
        ref_comment_id:comment.ref_comment?.id ?? null,
        content:comment.text,
        author:comment.author,
        upvote_count:comment.vote_count,
        created_at:new Date(comment.create_time),
        metadata:comment
    }
}
