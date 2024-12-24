import { GroupTopicAPIResponse } from "@/types/GroupTopic.ts";
import { GroupTopicAPITopicInfo } from "@/types/GroupTopic.ts";

type DateTinmeString = string



/**
 * 暂定通过 group/${groupId}/topics 接口获取的用户信息来做用户快照，因此通过该接口的用户信息去提取快照特征
 */
export type UserSnapshotFeature = {
    loc?:{
        uid:string
        id:string
        name:string
    }
    gender:string
    /**
     * 用户自定义的 id
     */
    uid:string
    id:string
    name:string
    avatar:string
    reg_time:DateTinmeString
}