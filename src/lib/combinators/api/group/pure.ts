import { TopicStatisticFeature } from "@/types/feature/TopicStatisticFeature.ts";
import { DoubanUserGender, UserSnapshotFeature } from "@/types/feature/UserSnapshotFeature.ts";
import type { GroupTopicAPIResponse, GroupTopicAPITopicInfo } from "@/types/GroupTopic.ts";


/**
 * 从小组帖子列表接口返回的帖子列表中的单条帖子数据中提取出用户信息特征
 * @param topicInfo 从小组帖子列表接口中，对应的单条帖子的数据
 */
export const mapGroupTopicAPITopicInfoToUserSnapshotFeature = (topicInfo:GroupTopicAPITopicInfo):UserSnapshotFeature => {
    const { author: authorMetaData, ...rest } = topicInfo;
    const { uid, name, avatar, gender,id } = authorMetaData;
    return {
        douban_id: id,
        douban_uid: uid,
        name,
        avatar,
        gender: gender as DoubanUserGender,
        user_created_at: new Date(authorMetaData.reg_time),
        user_avatar_url: authorMetaData.avatar,
        location: authorMetaData.loc,
        metadata: authorMetaData,
    }
}

export const mapGroupTopicAPIResponseToUserSnapshotFeatureLists = (groupTopicAPIResponse:GroupTopicAPIResponse) => {
    const { topics } = groupTopicAPIResponse;
    return topics.map(mapGroupTopicAPITopicInfoToUserSnapshotFeature);
}

export const mapGroupTopicAPIResponseToTopicIdLists = (groupTopicAPIResponse:GroupTopicAPIResponse) => {
    const { topics } = groupTopicAPIResponse;
    return topics.map(({ id }) => id);
}

export const mapGroupTopicAPITopicInfoToTopicIdLists = (topicInfo:GroupTopicAPITopicInfo) => {
    const { id } = topicInfo;
    return id;
}
