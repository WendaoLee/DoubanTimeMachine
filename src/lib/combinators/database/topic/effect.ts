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
import { fileURLToPath } from "url";
import path from "path";
import { User } from "@/database/entity/User.ts";

/**
 * 传入帖子相关的特征数据，新建对应的 Topic 索引记录
 * 如果已经存在，则返回已存在的记录，否则返回新建后的记录
 * @param topicFeatureData 
 * @returns 
 */
export const upsertTopicIndexRecordIfNotExist = (topicFeatureData:TopicContentFeature | TopicStatisticFeature) => 
    Effect.tryPromise({
        try:async () => {
            if(!GeneralContentDatasource.isInitialized){
                await GeneralContentDatasource.initialize()
            }
            const topicId = topicFeatureData.topic_id

            const exitedTopic = await GeneralContentDatasource.getRepository(Topic).findOne({where:{topic_id:topicId}})

            if(exitedTopic){
                exitedTopic.last_reply_at = new Date(topicFeatureData.topic_last_updated_at)
                return await GeneralContentDatasource.getRepository(Topic).save(exitedTopic)
            }

            const newTopic = new Topic()
            newTopic.topic_id = topicId
            newTopic.group_id = topicFeatureData.group_id
            newTopic.topic_created_at = new Date(topicFeatureData.topic_created_at)
            newTopic.author_uid = topicFeatureData.author_uid
            newTopic.author_id = topicFeatureData.author_id
            newTopic.last_reply_at = new Date(topicFeatureData.topic_last_updated_at)

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
                latestSnapshot.last_edit_time.getTime() !== topicContentFeature.topic_last_edited_at.getTime()

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

/**
 * 获取最新被回复的 XX 条的帖子以及对应的快照记录
 * @param limit 
 * @returns 
 */
export const getLatestTopicContentSnapshotWithTopicIndex = (limit:number) => 
    Effect.tryPromise({
        try:async () => {
            if(!GeneralContentDatasource.isInitialized){
                await GeneralContentDatasource.initialize()
            }

            return await GeneralContentDatasource
                .getRepository(Topic)
                .createQueryBuilder('topic')
                .leftJoinAndSelect('topic.topic_content_snapshots', 'content_snapshot')
                .where(qb => {
                    const subQuery = qb
                        .subQuery()
                        .select('MAX(cs.snapshot_at)')
                        .from(TopicContentSnapshot, 'cs')
                        .where('cs.topic_id = content_snapshot.topic_id')
                        .getQuery();
                    return 'content_snapshot.snapshot_at = ' + subQuery;
                })
                .orderBy('topic.last_reply_at', 'DESC')
                .limit(limit)
                .cache(true)
                .getMany();
        },
        catch:handleTypeORMErrorWithFucInfo('lib.combinators.database.topic.getLatestTopicContentSnapshot')
    })


/**
 * 获取指定 topicId 的帖子内容快照
 * @param topicId 
 * @returns 
 */
export const getTopicContentSnapshotsByTopicId = (topicId:string) => 
    Effect.tryPromise({
        try:async () => {
            if(!GeneralContentDatasource.isInitialized){
                await GeneralContentDatasource.initialize()
            }

            return await GeneralContentDatasource
                .getRepository(TopicContentSnapshot)
                .createQueryBuilder('snapshot')
                .cache(true)
                .where('snapshot.topic_id = :topicId', { topicId })
                .orderBy('snapshot.snapshot_at', 'DESC')
                .getMany()
        },
        catch:handleTypeORMErrorWithFucInfo('lib.combinators.database.topic.getTopicSnapshotsByTopicId')
    })


/**
 * 获取最新 XX 条的帖子信息，既包括帖子内容信息也包括对应的统计信息
 * @param limit 
 * @returns 
 */
export const getLatestTopicInfo = (limit:number) => 
    Effect.tryPromise({
        try:async () => {
            if(!GeneralContentDatasource.isInitialized){
                await GeneralContentDatasource.initialize()
            }

            return await GeneralContentDatasource
                .getRepository(Topic)
                .createQueryBuilder('topic')
                .leftJoinAndSelect('topic.topic_content_snapshots', 'content_snapshot')
                .leftJoinAndSelect('topic.topic_stat_snapshots', 'stat_snapshot')
                .where(qb => {
                    const contentSubQuery = qb
                        .subQuery()
                        .select('MAX(cs.snapshot_at)')
                        .from(TopicContentSnapshot, 'cs')
                        .where('cs.topic_id = content_snapshot.topic_id')
                        .getQuery();
                    return 'content_snapshot.snapshot_at = ' + contentSubQuery;
                })
                .andWhere(qb => {
                    const statSubQuery = qb
                        .subQuery()
                        .select('MAX(ss.snapshot_at)')
                        .from(TopicStatSnapshot, 'ss')
                        .where('ss.topic_id = stat_snapshot.topic_id')
                        .getQuery();
                    return 'stat_snapshot.snapshot_at = ' + statSubQuery;
                })
                .groupBy('topic.id, topic.topic_id, topic.group_id, topic.topic_created_at, topic.author_uid, topic.author_id, topic.last_reply_at, content_snapshot.id, stat_snapshot.id')
                .orderBy('topic.last_reply_at', 'DESC')
                .limit(limit)
                .cache(true)
                .getMany();
        },
        catch:handleTypeORMErrorWithFucInfo('lib.combinators.database.topic.getLatestTopicInfo')
    })

export const getTopicStatisticSnapshotsByTopicId = (topicId:string) => Effect.tryPromise({
    try:async () => {
        return await GeneralContentDatasource.getRepository(TopicStatSnapshot).find({where:{topic:{topic_id:topicId}}})
    },
    catch:handleTypeORMErrorWithFucInfo('lib.combinators.database.topic.getTopicStatisticSnapshotsByTopicId')
})

/**
 * 获取指定用户发布的最新帖子信息，既包括帖子内容信息也包括对应的统计信息
 * @param userUID 
 * @returns 
 */
export const getLatestTopicInfoByUserUID = (userUID:string) => Effect.tryPromise({
    try:async () => {
        if(!GeneralContentDatasource.isInitialized){
            await GeneralContentDatasource.initialize()
        }
        const reuslt = await GeneralContentDatasource
            .getRepository(Topic)
            .createQueryBuilder('topic')
            .leftJoinAndSelect('topic.topic_content_snapshots', 'content_snapshot')
            .leftJoinAndSelect('topic.topic_stat_snapshots', 'stat_snapshot')
            .where('topic.author_uid = :userUID', { userUID })
            .andWhere(qb => {
                const contentSubQuery = qb
                    .subQuery()
                    .select('MAX(cs.snapshot_at)')
                    .from(TopicContentSnapshot, 'cs')
                    .where('cs.topic_id = content_snapshot.topic_id')
                    .getQuery();
                return 'content_snapshot.snapshot_at = ' + contentSubQuery;
            })
            .andWhere(qb => {
                const statSubQuery = qb
                    .subQuery()
                    .select('MAX(ss.snapshot_at)')
                    .from(TopicStatSnapshot, 'ss')
                    .where('ss.topic_id = stat_snapshot.topic_id')
                    .getQuery();
                return 'stat_snapshot.snapshot_at = ' + statSubQuery;
            })
            .orderBy('topic.last_reply_at', 'DESC')
            .cache(true)
            .getMany();

            return Array.from(reuslt.reduce((acc, curr) => {
                // 如果 Map 中不存在该 topic_id 或者当前记录的 last_reply_at 更新，则更新 Map
                const existingTopic = acc.get(curr.topic_id)
                if (!existingTopic || curr.last_reply_at > existingTopic.topic.last_reply_at) {
                    acc.set(curr.topic_id, {
                        topic: curr,
                        content_snapshot: curr.topic_content_snapshots[0],
                        stat_snapshot: curr.topic_stat_snapshots[0]
                    })
                }
                return acc
            }, new Map()).values()) as Topic[]
    },
    catch:handleTypeORMErrorWithFucInfo('lib.combinators.database.topic.getLatestTopicInfoByUserUID')
})

export const getLatestTopicInfoByUserDoubanID = (doubanID:string) => Effect.tryPromise({
    try:async () => {
        if(!GeneralContentDatasource.isInitialized){
            await GeneralContentDatasource.initialize()
        }

        const reuslt = await GeneralContentDatasource
            .getRepository(Topic)
            .createQueryBuilder('topic')
            .leftJoinAndSelect('topic.topic_content_snapshots', 'content_snapshot')
            .leftJoinAndSelect('topic.topic_stat_snapshots', 'stat_snapshot')
            .where('topic.author_id = :doubanID', { doubanID })
            .andWhere(qb => {
                const contentSubQuery = qb
                    .subQuery()
                    .select('MAX(cs.snapshot_at)')
                    .from(TopicContentSnapshot, 'cs')
                    .where('cs.topic_id = content_snapshot.topic_id')
                    .getQuery();
                return 'content_snapshot.snapshot_at = ' + contentSubQuery;
            })
            .andWhere(qb => {
                const statSubQuery = qb
                    .subQuery()
                    .select('MAX(ss.snapshot_at)')
                    .from(TopicStatSnapshot, 'ss')
                    .where('ss.topic_id = stat_snapshot.topic_id')
                    .getQuery();
                return 'stat_snapshot.snapshot_at = ' + statSubQuery;
            })
            .orderBy('topic.last_reply_at', 'DESC')
            .cache(true)
            .getMany();

            return Array.from(reuslt.reduce((acc, curr) => {
                // 如果 Map 中不存在该 topic_id 或者当前记录的 last_reply_at 更新，则更新 Map
                const existingTopic = acc.get(curr.topic_id)
                if (!existingTopic || curr.last_reply_at > existingTopic.topic.last_reply_at) {
                    acc.set(curr.topic_id, {
                        topic: curr,
                        content_snapshot: curr.topic_content_snapshots[0],
                        stat_snapshot: curr.topic_stat_snapshots[0]
                    })
                }
                return acc
            }, new Map()).values()) as Topic[]
    },
    catch:handleTypeORMErrorWithFucInfo('lib.combinators.database.topic.getLatestTopicInfoByUserDoubanID')
})

if(fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) || process.argv[1].includes('quokka-vscode')){
    const result = await Effect.runPromise(getLatestTopicInfo(20))
    console.log(result)
}
