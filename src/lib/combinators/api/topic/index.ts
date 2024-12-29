import { Effect } from "effect";
import { doubanFetch,getEncrypedParamsByDefaultEnv } from "@/lib/combinators/utils/index.ts";
import { TopicAPIResponse } from "@/types/Topic.ts";

/**
 * 获取一个帖子的详细信息，包括主楼内容
 * @param topicId 话题 id
 * @returns 
 */
export const fetchTopicDetail = (topicId:string) => Effect.Do.pipe(
    Effect.let('url',() => `https://frodo.douban.com/api/v2/group/topic/${topicId}`),
    Effect.bind('params',({url}) => getEncrypedParamsByDefaultEnv(url,'GET')),
    Effect.flatMap(({url,params}) => doubanFetch<TopicAPIResponse>(url,params))
)



import { fileURLToPath } from "url";
import path from "path";

if(fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) || process.argv[1].includes('quokka-vscode')){
    console.warn(`正在运行单个文件的 run - test，它仅用于单独文件运行与 Quokkajs 调试。如果这是在生产环境下出现该日志，请检查是否出现了问题//文件路径:${fileURLToPath(import.meta.url)}`)

    const result = await Effect.runPromise(fetchTopicDetail("315206690"))
}