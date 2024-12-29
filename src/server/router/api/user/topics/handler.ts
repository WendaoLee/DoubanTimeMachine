import { Request, Response } from "express";
import { getLatestTopicInfoByUserDoubanID, getLatestTopicInfoByUserUID } from "@/lib/combinators/database/topic/effect.ts";
import { Effect } from "effect";
import { Topic } from "@/database/entity/Topic.ts";

type UserLatestTopicInfoStruct = {
    topics:Topic[]
}

const getUserLatestTopicInfoByDoubanIDPipeline = (doubanID:string) => Effect.gen(function*(){
    const topics = yield* getLatestTopicInfoByUserDoubanID(doubanID)
    return {
        topics:topics
    } as UserLatestTopicInfoStruct
})

const getUserLatestTopicInfoPipeline = (doubanUID:string) => Effect.gen(function*(){
    const topics = yield* getLatestTopicInfoByUserUID(doubanUID)
    return {
        topics:topics
    } as UserLatestTopicInfoStruct
})

export const getUserLatestTopicInfoHandler = async (req:Request,res:Response) => {
    try{
        const doubanUID = req.query.uid as string
        const doubanID = req.query.id as string 
        if(!doubanUID && !doubanID){
            res.status(400).json({code:400,message:'Douban UID or ID is required'})
            return
        }
        if(doubanUID){
            const result = await Effect.runPromise(getUserLatestTopicInfoPipeline(doubanUID))
            res.status(200).json({
                code:200,
                data:result,
                message:''
            })
        }else{
            const result = await Effect.runPromise(getUserLatestTopicInfoByDoubanIDPipeline(doubanID))
            res.status(200).json({
                code:200,
                data:result,
                message:''
            })
        }
    }catch(error){
        res.status(500).json({code:500,message:'Internal server error'})
    }
}
