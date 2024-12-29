import { UserSnapshot } from "@/database/entity/UserSnapshot.ts";
import { User } from "@/database/entity/User.ts";
import { UserSnapshotFeature } from "@/types/feature/UserSnapshotFeature.ts";
import { Effect } from "effect";
import { handleTypeORMError } from "@/types/error/TypeORMWrappedError.ts";
import { GeneralContentDatasource } from "@/database/datasource.ts";

/**
 * 传入用户快照特征数据，新建对应的 User 索引记录
 * 如果已经存在，则返回已存在的记录，否则返回新建后的记录
 * @param userSnapshotFeature 
 * @returns 
 */
export const createUserIndexRecordIfNotExist = (userSnapshotFeature:UserSnapshotFeature) => 
    Effect.tryPromise({
        try:async () => {
            if(!GeneralContentDatasource.isInitialized){
                await GeneralContentDatasource.initialize()
            }

            const user_id = userSnapshotFeature.douban_id

            const exitedUser = await GeneralContentDatasource.getRepository(User).findOne({where:{douban_id:user_id}})

            if(exitedUser){
                return exitedUser
            }

            const newUser = new User()
            newUser.douban_id = user_id
            newUser.douban_uid = userSnapshotFeature.douban_uid
            newUser.user_created_at = userSnapshotFeature.user_created_at

            return await GeneralContentDatasource.getRepository(User).save(newUser)
        },
        catch:handleTypeORMError
    })

/**
 * 传入用户快照特征数据，新建对应的 UserSnapshot 记录
 * 如果已经存在，则返回已存在的记录，否则返回新建后的记录
 * @param userSnapshotFeature 
 * @returns 
 */
export const upsertUserSnapshotRecordIfNotExist = (userSnapshotFeature:UserSnapshotFeature) => 
    Effect.tryPromise({
        try:async () => {
            if(!GeneralContentDatasource.isInitialized){
                await GeneralContentDatasource.initialize()
            }

            const user_id = userSnapshotFeature.douban_id

            const latestSnapshot = await GeneralContentDatasource.getRepository(UserSnapshot).findOne({where:{user:{douban_id:user_id}},order:{snapshot_at:'DESC'}})

            /**
             * 检查是否要新建记录。
             * 逻辑为：
             * 1. 如果快照不存在，则新建快照
             * 2. 如果快照存在，则检查统计特征是否发生变化，如果发生变化，则新建快照
             * 
             * 存在以下检查项判断是否要更新记录：
             * 1. 性别
             * 2. 头像
             * 3. 名称
             * 4. 位置
             * 5. 豆瓣 UID
             */
            const needNewSnapshot = !latestSnapshot || 
                latestSnapshot.gender !== userSnapshotFeature.gender ||
                latestSnapshot.avatar !== userSnapshotFeature.avatar ||
                latestSnapshot.name !== userSnapshotFeature.name ||
                latestSnapshot?.ip?.id !== userSnapshotFeature.location?.id ||
                latestSnapshot.user_uid !== userSnapshotFeature.douban_uid

            if(needNewSnapshot){
                const newSnapshot = new UserSnapshot()
                newSnapshot.user = await GeneralContentDatasource.getRepository(User).findOneByOrFail({douban_id:user_id})
                newSnapshot.gender = userSnapshotFeature.gender
                newSnapshot.avatar = userSnapshotFeature.avatar
                newSnapshot.name = userSnapshotFeature.name
                newSnapshot.ip = userSnapshotFeature.location ?? null
                newSnapshot.user_uid = userSnapshotFeature.douban_uid
                newSnapshot.metadata = userSnapshotFeature.metadata

                return await GeneralContentDatasource.getRepository(UserSnapshot).save(newSnapshot)
            }
        },
        catch:handleTypeORMError
    })  

/**
 * 传入豆瓣id（不是uid），获取指定用户的最新快照
 * @param doubanId 
 * @returns 
 */
export const getUserLatestSnapshotByDoubanId = (doubanId:string) => Effect.tryPromise({
    try:async () => {
        if(!GeneralContentDatasource.isInitialized){
            await GeneralContentDatasource.initialize()
        }

        return await GeneralContentDatasource.getRepository(UserSnapshot).findOne({where:{user:{douban_id:doubanId}},order:{snapshot_at:'DESC'},cache:true})
    },
    catch:handleTypeORMError
})

/**
 * 传入豆瓣uid，获取指定用户的所有快照
 * @param doubanUID 
 * @returns 
 */
export const getUserSnapshotsByDoubanUID = (doubanUID:string) => Effect.tryPromise({
    try:async () => {
        if(!GeneralContentDatasource.isInitialized){
            await GeneralContentDatasource.initialize()
        }

        return await GeneralContentDatasource.getRepository(UserSnapshot).find({where:{user_uid:doubanUID}})
    },
    catch:handleTypeORMError
})

export const getUserLatestSnapshotByDoubanUID = (doubanUID:string) => Effect.tryPromise({
    try:async () => {
        if(!GeneralContentDatasource.isInitialized){
            await GeneralContentDatasource.initialize()
        }

        return await GeneralContentDatasource.getRepository(UserSnapshot).findOne({where:{user_uid:doubanUID},order:{snapshot_at:'DESC'}})
    },
    catch:handleTypeORMError
})
