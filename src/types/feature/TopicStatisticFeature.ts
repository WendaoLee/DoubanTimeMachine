import type { GroupTopicAPITopicInfo } from "@/types/GroupTopic.ts";

/**
 * 从 @type {GroupTopicAPITopicInfo} 中提取的帖子统计数据特征。
 * 由于：
 * - 如果对应帖子不存在，需要同时新建 Topic 和 TopicStatSnapshot 的记录，因此需要有比较多的信息
 */
export type TopicStatisticFeature = {
    _tag_:"topic_statistic_feature"
    topic_id: string;
    group_id: string;
    author_uid: string;
    author_id: string;
    /**
     * 回复数量
     */
    reply_count: number;
    /**
     * 收藏数量
     */
    collect_count: number;
    /**
     * 点赞数量
     */
    favorite_count: number;
    /**
     * 转发数量
     */
    reshare_count: number;
    /**
     * 即接口数据中的 update_time 字段
     */
    topic_last_updated_at: Date;
    /**
     * 如果帖子不存在对应的 edit 时间信息
     * 那么说明帖子没有被编辑过
     * 此时，last_edit_time 应该与 create_time 相同
     */
    topic_last_edited_at: Date;
    topic_created_at: Date;
}
