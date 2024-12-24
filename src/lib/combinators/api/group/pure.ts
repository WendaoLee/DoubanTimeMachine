import { TopicStatisticFeature } from "@/types/feature/TopicStatisticFeature.ts";
import { DoubanUserGender, UserInfoFeature } from "@/types/feature/UserInfoFeature.ts";
import type { GroupTopicAPITopicInfo } from "@/types/GroupTopic.ts";


/**
 * 从小组帖子列表接口返回的帖子列表中的单条帖子数据中提取出用户信息特征
 * @param topicInfo 从小组帖子列表接口中，对应的单条帖子的数据
 */
export const mapGroupTopicAPITopicInfoToUserInfoFeature = (topicInfo:GroupTopicAPITopicInfo):UserInfoFeature => {
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