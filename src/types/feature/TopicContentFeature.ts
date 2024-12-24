import { TopicAPIResponse } from "../Topic.ts"

/**
 * 帖子内容快照特征
 */
export type TopicContentFeature = {
    topic_id:string
    group_id:string
    author_uid:string
    author_id:string
    title:string
    content:string
    last_edit_time:Date
    topic_created_at:Date
    topic_last_edited_at:Date
    /**
     * 从接口里能拿到的数据，该值为帖子最新被回复的时间，而不是帖子本身的编辑时间
     */
    topic_updated_at:Date
    metadata:TopicAPIResponse
}