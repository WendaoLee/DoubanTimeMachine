import { DoubanComment } from "../Comments.ts"

/**
 * 帖子的回复数据特征，用于存储到数据库中
 */
export type CommentFeature = {
    _tag_:"comment_feature"
    topic_id:string
    comment_id:string
    ref_comment_id:string | null
    content:string
    author:DoubanComment['author']
    upvote_count:number
    created_at:Date
    metadata:DoubanComment
}
