import { Effect } from "effect"
import { createTopicIndexRecordIfNotExist,upsertTopicStatisticSnapshot,upsertTopicContentSnapshot } from "./topic/effect.ts"
import { TopicStatisticFeature } from "@/types/feature/TopicStatisticFeature.ts"
import { TopicContentFeature } from "@/types/feature/TopicContentFeature.ts"
import { createUserIndexRecordIfNotExist, upsertUserSnapshotRecordIfNotExist } from "./user/effect.ts"
import { UserSnapshotFeature } from "@/types/feature/UserSnapshotFeature.ts"
import { fileURLToPath } from "url"
import path from "path"


export const processTopicStatistcSnapshot = (topicStatisticFeature:TopicStatisticFeature) => 
    Effect.Do.pipe(
        Effect.bind('topicIndexRecord',() => createTopicIndexRecordIfNotExist(topicStatisticFeature)),
        Effect.bind('topicStatisticSnapshot',() => upsertTopicStatisticSnapshot(topicStatisticFeature)),
        Effect.map(({topicIndexRecord,topicStatisticSnapshot}) => ({
        }))
    )

export const processTopicContentSnapshot = (topicContentFeature:TopicContentFeature) => 
    Effect.Do.pipe(
        Effect.bind('topicIndexRecord',() => createTopicIndexRecordIfNotExist(topicContentFeature)),
        Effect.bind('topicContentSnapshot',() => upsertTopicContentSnapshot(topicContentFeature)),
        Effect.map(({topicIndexRecord,topicContentSnapshot}) => ({
        }))
    )


export const processUserSnapshot = (userSnapshotFeature:UserSnapshotFeature) => 
    Effect.Do.pipe(
        Effect.bind('userIndexRecord',() => createUserIndexRecordIfNotExist(userSnapshotFeature)),
        Effect.bind('userSnapshot',() => upsertUserSnapshotRecordIfNotExist(userSnapshotFeature)),
        Effect.map(({userIndexRecord,userSnapshot}) => ({
        }))
    )

// if(fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) || process.argv[1].includes('quokka-vscode')){
//     console.warn(`正在运行单个文件的 run - test，它仅用于单独文件运行与 Quokkajs 调试。如果这是在生产环境下出现该日志，请检查是否出现了问题//文件路径:${fileURLToPath(import.meta.url)}`)
//     const sampleUserSnapshotFeature:UserSnapshotFeature = {
//         douban_id: '282863689',
//         douban_uid: '282863689',
//         name: '口禾火🍈',
//         avatar: 'https://img9.doubanio.com/icon/up282863689-4.jpg',
//         gender: 'M',
//         user_created_at: new Date('2024-08-18T08:03:34.000Z'),
//         user_avatar_url: 'https://img9.doubanio.com/icon/up282863689-4.jpg',
//         location: {
//             uid: '282863689',
//             id: '282863689',
//             name: '口禾火🍈',
//         },
//         metadata: {
//             loc: null,
//             is_banned_forever: false,
//             followed: false,
//             uid: '282863689',
//             url: 'https://www.douban.com/people/282863689/',
//             gender: '',
//             reg_time: '2024-08-18 16:03:34',
//             is_readonly_forever: false,
//             uri: 'douban://douban.com/user/282863689',
//             name: '口禾火🍈',
//             is_club: false,
//             kind: 'user',
//             type: 'user',
//             id: '282863689',
//             avatar: 'https://img9.doubanio.com/icon/up282863689-4.jpg'
//         }
//     }
//     console.time('processUserSnapshot')
//     const result = await Effect.runPromise(processUserSnapshot(sampleUserSnapshotFeature))
//     console.timeEnd('processUserSnapshot')
//     console.log(result)
// }

