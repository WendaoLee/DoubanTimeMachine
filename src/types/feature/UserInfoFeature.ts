import type { GroupTopicAPITopicInfo } from "@/types/GroupTopic.ts";
import type { DoubanComment } from "@/types/Comments.ts";


export type DoubanUserGender = 'M' | 'F' | 'U';

/**
 * 从 @type {GroupTopicAPITopicInfo,DoubanComment} 中可以提取出用户信息特征
 */
export type UserInfoFeature = {
    douban_id: string;
    douban_uid: string;
    name: string;
    avatar: string;
    gender: DoubanUserGender;
    user_created_at: Date;
    user_avatar_url: string;
    location?:{
        uid: string;
        id: string;
        /**
         * 位置的中文名
         */
        name: string;
    },
    metadata: GroupTopicAPITopicInfo['author']
}
