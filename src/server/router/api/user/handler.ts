import { UserSnapshot } from "@/database/entity/UserSnapshot.ts";
import { getUserLatestSnapshotByDoubanId,getUserLatestSnapshotByDoubanUID,getUserSnapshotsByDoubanID,getUserSnapshotsByDoubanUID } from "@/lib/combinators/database/user/effect.ts";
import { Effect } from "effect";
import { Request, Response } from "express";


type UserInfoStruct = {
    user_snapshots:UserSnapshot[]
}

const getUserInfoByDoubanUIDPipeline = (doubanUID:string) => Effect.gen(function*(){
    const userSnapshots = yield* getUserSnapshotsByDoubanUID(doubanUID)
    return {
        user_snapshots:userSnapshots
    } as UserInfoStruct
})

const getUserInfoByDoubanIDPipeline = (doubanID:string) => Effect.gen(function*(){
    const userSnapshots = yield* getUserSnapshotsByDoubanID(doubanID)
    return {
        user_snapshots:userSnapshots
    } as UserInfoStruct
})

export const getUserInfoByDoubanUIDHandler = async (req:Request,res:Response) => {
    try{
        const doubanUID = req.query.uid as string
        const doubanID = req.query.id as string
        if(!doubanUID && !doubanID){
            res.status(400).json({code:400,message:'Douban UID is required'})
            return
        }
        if(doubanUID){
            const result = await Effect.runPromise(getUserInfoByDoubanUIDPipeline(doubanUID))
            if(result.user_snapshots.length === 0){
                res.status(404).json({code:404,data:{},message:'User not found'})
                return
            }
            res.status(200).json({
                code:200,
                data:result,
                message:''
            })
            return
        }else{
            const result = await Effect.runPromise(getUserInfoByDoubanIDPipeline(doubanID))
            res.status(200).json({
                code:200,
                data:result,
                message:''
            })
            return
        }
    }catch(error){
        res.status(500).json({code:500,message:'Internal server error'})
    }
}
