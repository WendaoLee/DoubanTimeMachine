import { Effect } from "effect";
import { getEncrypedParamsByDefaultEnv,doubanFetch } from "@/lib/combinators/utils/index.ts";
import { GroupTopicAPIResponse } from "@/types/GroupTopic.ts";

/**
 * 获取小组帖子
 * @param groupId 小组ID
 * @returns 帖子数据
 */
export const getGroupTopics = (groupId:string) => Effect.Do.pipe(
    Effect.let('api',()=>`https://frodo.douban.com/api/v2/group/${groupId}/topics`),
    Effect.bind('params',({api}) => getEncrypedParamsByDefaultEnv(api,'GET')),
    Effect.bind('result',({api,params}) => doubanFetch<GroupTopicAPIResponse>(api,params)),
    Effect.map(({result}) => result)
)


export const getGroup = (groupId:string) => Effect.Do.pipe(
    Effect.let('api',()=>`https://frodo.douban.com/api/v2/group/${groupId}`),
    Effect.bind('params',({api}) => getEncrypedParamsByDefaultEnv(api,'GET')),
    Effect.bind('result',({api,params}) => doubanFetch<GroupTopicAPIResponse>(api,params)),
    Effect.map(({result}) => result)
)


import { fileURLToPath } from "url";
import path from "path";

if(fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) || process.argv[1].includes('quokka-vscode')){
    console.warn(`正在运行单个文件的 run - test，它仅用于单独文件运行与 Quokkajs 调试。如果这是在生产环境下出现该日志，请检查是否出现了问题//文件路径:${fileURLToPath(import.meta.url)}`)
    const result = await Effect.runPromise(getGroup('728957'))
    const result2 = await Effect.runPromise(getGroupTopics('728957'))
}

