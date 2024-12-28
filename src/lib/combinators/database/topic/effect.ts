import { Effect } from "effect";
import { Topic } from "@/database/entity/Topic.ts";
import { GeneralContentDatasource } from "@/database/datasource.ts";
import type { GroupTopicAPITopicInfo,GroupTopicAPIResponse } from "@/types/GroupTopic.ts";
import { TopicContentSnapshot } from "@/database/entity/TopicContentSnapshot.ts";
import { TopicStatSnapshot } from "@/database/entity/TopicStatSnapshot.ts";
import { TopicAPIResponse } from "@/types/Topic.ts";
import { TopicContentFeature } from "@/types/feature/TopicContentFeature.ts";
import { TopicStatisticFeature } from "@/types/feature/TopicStatisticFeature.ts";
import { handleTypeORMError } from "@/types/error/TypeORMWrappedError.ts";
import { handleTypeORMErrorWithFucInfo } from "@/types/error/TypeORMWrappedError.ts";

/**
 * 传入帖子相关的特征数据，新建对应的 Topic 索引记录
 * 如果已经存在，则返回已存在的记录，否则返回新建后的记录
 * @param topicFeatureData 
 * @returns 
 */
export const createTopicIndexRecordIfNotExist = (topicFeatureData:TopicContentFeature | TopicStatisticFeature) => 
    Effect.tryPromise({
        try:async () => {
            if(!GeneralContentDatasource.isInitialized){
                await GeneralContentDatasource.initialize()
            }
            const topicId = topicFeatureData.topic_id

            const exitedTopic = await GeneralContentDatasource.getRepository(Topic).findOne({where:{topic_id:topicId}})

            if(exitedTopic){
                return exitedTopic
            }

            const newTopic = new Topic()
            newTopic.topic_id = topicId
            newTopic.group_id = topicFeatureData.group_id
            newTopic.topic_created_at = new Date(topicFeatureData.topic_created_at)
            newTopic.author_uid = topicFeatureData.author_uid
            newTopic.author_id = topicFeatureData.author_id

            return await GeneralContentDatasource.getRepository(Topic).save(newTopic)
        },
        catch:handleTypeORMError
    })

/**
 * 传入 TopicStatisticFeature 数据，比对最新的 TopicStatSnapshot 记录，判断是否需要插入新的记录。如果统计特征发生了变化，那么便插入新的快照记录;如果不存在相应特征，同样插入新的快照记录。
 * @param topicStatisticFeature 
 * @returns 
 */
export const upsertTopicStatisticSnapshot = (topicStatisticFeature:TopicStatisticFeature) => 
    Effect.tryPromise({
        try:async () => {
            if(!GeneralContentDatasource.isInitialized){
                await GeneralContentDatasource.initialize()
            }

            const topicId = topicStatisticFeature.topic_id

            // 获取最新的统计快照记录
            const latestSnapshot = await GeneralContentDatasource
                .getRepository(TopicStatSnapshot)
                .createQueryBuilder('snapshot')
                .where('snapshot.topic_id = :topicId', { topicId })
                .orderBy('snapshot.snapshot_at', 'DESC')
                .getOne()
            
            /**
             * 检查是否要新建记录。
             * 逻辑为：
             * 1. 如果快照不存在，则新建快照
             * 2. 如果快照存在，则检查统计特征是否发生变化，如果发生变化，则新建快照
             */
            const needNewSnapshot = !latestSnapshot || 
                latestSnapshot.reply_count !== topicStatisticFeature.reply_count ||
                latestSnapshot.favorite_count !== topicStatisticFeature.favorite_count ||
                latestSnapshot.collect_count !== topicStatisticFeature.collect_count ||
                latestSnapshot.reshare_count !== topicStatisticFeature.reshare_count

            if (needNewSnapshot) {
                const newSnapshot = new TopicStatSnapshot()
                newSnapshot.topic = await GeneralContentDatasource
                    .getRepository(Topic)
                    .findOneByOrFail({ topic_id: topicId })
                newSnapshot.reply_count = topicStatisticFeature.reply_count
                newSnapshot.favorite_count = topicStatisticFeature.favorite_count
                newSnapshot.collect_count = topicStatisticFeature.collect_count
                newSnapshot.reshare_count = topicStatisticFeature.reshare_count
                newSnapshot.last_reply_time = topicStatisticFeature.topic_last_edited_at 

                return await GeneralContentDatasource
                    .getRepository(TopicStatSnapshot)
                    .save(newSnapshot)
            }

            return latestSnapshot
        },
        catch:handleTypeORMErrorWithFucInfo('lib.combinators.database.topic.upsertTopicStatisticSnapshot')
    })

/**
 * 传入 TopicContentFeature 数据，比对最新的 TopicContentSnapshot 记录，判断是否需要插入新的记录。
 * 它的更新直接根据 last_edited_at 来判断是否需要更新。
 * @param topicContentFeature 
 * @returns 
 */
export const upsertTopicContentSnapshot = (topicContentFeature:TopicContentFeature) => 
    Effect.tryPromise({
        try:async () => {
            if(!GeneralContentDatasource.isInitialized){
                await GeneralContentDatasource.initialize()
            }

            const topicId = topicContentFeature.topic_id

            const latestSnapshot = await GeneralContentDatasource
                .getRepository(TopicContentSnapshot)
                .createQueryBuilder('snapshot')
                .where('snapshot.topic_id = :topicId', { topicId })
                .orderBy('snapshot.snapshot_at', 'DESC')
                .getOne()

            const needNewSnapshot = !latestSnapshot || 
                latestSnapshot.last_edit_time !== topicContentFeature.topic_last_edited_at

            if(needNewSnapshot){
                const newSnapshot = new TopicContentSnapshot()
                newSnapshot.topic = await GeneralContentDatasource
                    .getRepository(Topic)
                    .findOneByOrFail({ topic_id: topicId })
                newSnapshot.last_edit_time = topicContentFeature.topic_last_edited_at
                newSnapshot.topic_updated_at = topicContentFeature.topic_last_updated_at
                newSnapshot.topic_created_at = topicContentFeature.topic_created_at
                newSnapshot.author_uid = topicContentFeature.author_uid
                newSnapshot.author_id = topicContentFeature.author_id
                newSnapshot.metadata = topicContentFeature.metadata
                newSnapshot.content = topicContentFeature.content
                newSnapshot.title = topicContentFeature.title

                return await GeneralContentDatasource
                    .getRepository(TopicContentSnapshot)
                    .save(newSnapshot)
            }

            return latestSnapshot
        },
        catch:handleTypeORMErrorWithFucInfo('lib.combinators.database.topic.upsertTopicContentSnapshot')
    })
