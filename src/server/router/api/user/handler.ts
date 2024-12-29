import { UserSnapshot } from "@/database/entity/UserSnapshot.ts";
import { getUserLatestSnapshotByDoubanId,getUserLatestSnapshotByDoubanUID,getUserSnapshotsByDoubanUID } from "@/lib/combinators/database/user/effect.ts";
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

export const getUserInfoByDoubanUIDHandler = async (req:Request,res:Response) => {
    try{
        const doubanUID = req.query.uid as string
        if(!doubanUID){
            res.status(400).json({code:400,message:'Douban UID is required'})
            return
        }
        const result = await Effect.runPromise(getUserInfoByDoubanUIDPipeline(doubanUID))
        res.status(200).json({
            code:200,
            data:result,
            message:''
        })
    }catch(error){
        res.status(500).json({code:500,message:'Internal server error'})
    }
}
