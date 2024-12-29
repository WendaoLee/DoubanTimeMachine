import { Request, Response } from "express";
import { getUserAllComments,getUserAllCommentsByDoubanID } from "@/lib/combinators/database/comments/effect.ts";
import { Effect } from "effect";
import { Comments } from "@/database/entity/comments.ts";

type UserAllCommentsStruct = {
    groupedComments:Record<string,Comments[]>
}

const getUserAllCommentsPipeline = (doubanUID:string) => Effect.gen(function*(){
    const comments = yield* getUserAllComments(doubanUID)
    const groupedComments = comments.reduce((acc,comment)=>{
        acc[comment.topic.topic_id] = acc[comment.topic.topic_id] || []
        acc[comment.topic.topic_id].push(comment)
        return acc
    },{} as Record<string,Comments[]>)
    return {
        groupedComments:groupedComments
    } as UserAllCommentsStruct
})

const getUserAllCommentsByDoubanIDPipeline = (doubanID:string) => Effect.gen(function*(){
    const comments = yield* getUserAllCommentsByDoubanID(doubanID)
    const groupedComments = comments.reduce((acc,comment)=>{
        acc[comment.topic.topic_id] = acc[comment.topic.topic_id] || []
        acc[comment.topic.topic_id].push(comment)
        return acc
    },{} as Record<string,Comments[]>)
    return {
        groupedComments:groupedComments
    } as UserAllCommentsStruct
})

export const getUserAllCommentsHandler = async (req:Request,res:Response) => {
    try{
        const doubanUID = req.query.uid as string
        const doubanID = req.query.id as string 
        if(!doubanUID && !doubanID){
            res.status(400).json({code:400,message:'Douban UID or ID is required'})
            return
        }
        if(doubanUID){
            const result = await Effect.runPromise(getUserAllCommentsPipeline(doubanUID))
            res.status(200).json({
                code:200,
                data:result,
                message:''
            })
        }else{
            const result = await Effect.runPromise(getUserAllCommentsByDoubanIDPipeline(doubanID))
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