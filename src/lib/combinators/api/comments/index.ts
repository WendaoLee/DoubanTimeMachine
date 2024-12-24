import { Effect } from "effect";
import { doubanFetch,getEncrypedParamsByDefaultEnv } from "@/lib/combinators/utils/index.ts";
import { CommentsResponse,DoubanComment as DoubanComment } from "@/types/Comments.ts";
import { COMMON_PARAMS } from "./constants.ts";

/**
 * 获取一个帖子的评论
 * @param topicId 话题 id
 * @returns 
 */
export const fetchTopicComments = (topicId:string) => Effect.Do.pipe(
    Effect.let('url',() => `https://frodo.douban.com/api/v2/group/topic/${topicId}/comments`),
    Effect.bind('params',({url}) => getEncrypedParamsByDefaultEnv(url,'GET')),
    Effect.flatMap(({url,params}) => doubanFetch<CommentsResponse>(url,params))
)

/**
 * 获取一个帖子的评论，通过 start 和 count 查询，建议是一次获取20条。
 * @param topicId 话题 id
 * @param start 开始索引
 * @param count 从开始索引获取的数量
 * @returns 
 */
export const fetchTopicCommentsByStartCountQuery = (topicId:string,start:number,count:number) => Effect.Do.pipe(
    Effect.let('url',() => `https://frodo.douban.com/api/v2/group/topic/${topicId}/comments`),
    Effect.bind('params',({url}) => getEncrypedParamsByDefaultEnv(url,'GET',{start,count,...COMMON_PARAMS})),
    Effect.flatMap(({url,params}) => doubanFetch<CommentsResponse>(url,params))
)

/**
 * 获取一个帖子的所有评论
 * @param topicId 话题 id
 * @returns 
 */
export const fetchAllTopicComments = (topicId:string) => Effect.gen(function* () {
    let start = 0
    let count = 20
    let comments:DoubanComment[] = []
    while(true){
        const result = yield* fetchTopicCommentsByStartCountQuery(topicId,start,count)
        const targetComments = result.comments
        comments.push(...targetComments)
        start += count
        if(targetComments.length < count){
            break
        }
    }
    return comments
})

/**
 * 传入帖子id以及起始评论数，获取剩余的评论数
 * @param topicId 帖子id
 * @param start 起始评论数
 * @returns 
 */
/**
 * 传入帖子id以及起始评论数，获取剩余的评论数
 * @param topicId 帖子id
 * @param start 起始评论数
 * @returns 所有剩余的评论
 */
export const fetchRemainedTopicComments = (topicId: string, start: number) => Effect.gen(function* () {
    // 先获取第一页评论来得到总评论数
    const firstResult = yield* Effect.Do.pipe(
        Effect.let('url', () => `https://frodo.douban.com/api/v2/group/topic/${topicId}/comments`),
        Effect.bind('params', ({url}) => getEncrypedParamsByDefaultEnv(url, 'GET', {start: 0, count: 1, ...COMMON_PARAMS})),
        Effect.flatMap(({url, params}) => doubanFetch<CommentsResponse>(url, params))
    )

    const total = firstResult.total
    const remainingCount = total - start
    let comments: DoubanComment[] = []

    // 如果没有剩余评论，直接返回空数组
    if (remainingCount <= 0) {
        return comments
    }

    // 分批获取剩余评论
    let currentStart = start
    const batchSize = 20

    while (currentStart < total) {
        const result = yield* Effect.Do.pipe(
            Effect.let('url', () => `https://frodo.douban.com/api/v2/group/topic/${topicId}/comments`),
            Effect.bind('params', ({url}) => getEncrypedParamsByDefaultEnv(url, 'GET', {
                start: currentStart,
                count: batchSize,
                ...COMMON_PARAMS
            })),
            Effect.flatMap(({url, params}) => doubanFetch<CommentsResponse>(url, params))
        )
        
        comments.push(...result.comments)
        currentStart += batchSize
    }

    return comments
})


// const result = await Effect.runPromise(fetchRemainedTopicComments("266788909",200))
// console.log(result)

