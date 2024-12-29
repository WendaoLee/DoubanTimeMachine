import { Request, Response } from "express";
import { getUserAllComments } from "@/lib/combinators/database/comments/effect.ts";
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

export const getUserAllCommentsHandler = async (req:Request,res:Response) => {
    try{
        const doubanUID = req.query.uid as string
        if(!doubanUID){
            res.status(400).json({code:400,message:'Douban UID is required'})
            return
        }
        const result = await Effect.runPromise(getUserAllCommentsPipeline(doubanUID))
        res.status(200).json({
            code:200,
            data:result,
            message:''
        })
    }catch(error){
        res.status(500).json({code:500,message:'Internal server error'})
    }   
}