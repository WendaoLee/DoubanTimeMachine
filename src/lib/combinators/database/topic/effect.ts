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
            newTopic.topic_last_edited_at = new Date(topicFeatureData.topic_last_edited_at)
            newTopic.topic_last_updated_at = new Date(topicFeatureData.topic_last_updated_at)
            newTopic.author_uid = topicFeatureData.author_uid
            newTopic.author_id = topicFeatureData.author_id

            return await GeneralContentDatasource.getRepository(Topic).save(newTopic)
        },
        catch:handleTypeORMError
    })

export const upsertTopicStatisticSnapshot = (topicStatisticFeature:TopicStatisticFeature) => 
    Effect.tryPromise({
        try:async () => {
            if(!GeneralContentDatasource.isInitialized){
                await GeneralContentDatasource.initialize()
            }

            const topicId = topicStatisticFeature.topic_id

            const target = await GeneralContentDatasource
                .getRepository(TopicStatSnapshot)
                .createQueryBuilder('snapshot')
                .where('snapshot.topic_id = :topicId', { topicId })
                .orderBy('snapshot.created_at', 'DESC')
                .getOne()

        },
        catch:handleTypeORMError
    })
