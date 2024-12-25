import { TopicContentFeature } from "@/types/feature/TopicContentFeature.ts"
import { TopicStatisticFeature } from "@/types/feature/TopicStatisticFeature.ts"
import { TopicAPIResponse } from "@/types/Topic.ts"


export const mapTopicAPITopicInfoToTopicStatisticFeature = (topicInfo:TopicAPIResponse):TopicStatisticFeature => {
    const { id,reshares_count,reactions_count,update_time,comments_count,group,create_time,collections_count,edit_time,author} = topicInfo
    return {
        topic_id: id,
        group_id: group.id,
        author_uid: author.uid,
        author_id: author.id,
        reshare_count: reshares_count,
        reply_count: comments_count,
        favorite_count: reactions_count,
        topic_created_at: new Date(create_time),
        topic_last_updated_at: new Date(update_time),
        topic_last_edited_at: edit_time ? new Date(edit_time) : new Date(create_time),
        collect_count: collections_count,
    }
}

export const mapTopicAPITopicInfoToTopicContentFeature = (topicInfo:TopicAPIResponse):TopicContentFeature => {
    const { id,content,title,author,create_time,update_time,edit_time,group} = topicInfo
    return {
        topic_id: id,
        content: content,
        title: title,
        author_uid: author.id,
        author_id: author.uid,
        topic_created_at: new Date(create_time),
        topic_last_edited_at: edit_time ? new Date(edit_time) : new Date(create_time),
        topic_last_updated_at: new Date(update_time),
        group_id: group.id,
        metadata: topicInfo,
    }
}
