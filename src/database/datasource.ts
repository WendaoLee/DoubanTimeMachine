import 'reflect-metadata'
import { DatabaseType, DataSource, DataSourceOptions } from "typeorm"
import { DATABASE_TYPE, DATABASE_HOST, DATABASE_PORT, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } from "@/lib/constants/DATABASE.ts"
import { Topic } from "./entity/Topic.ts"
import { TopicContentSnapshot } from "./entity/TopicContentSnapshot.ts"
import { TopicStatSnapshot } from "./entity/TopicStatSnapshot.ts"
import { UserSnapshot } from "./entity/UserSnapshot.ts"
import { Comments } from './entity/comments.ts'
import { User } from './entity/User.ts'


/**
 * 存储爬取的所有数据的数据库
 */
export const GeneralContentDatasource = new DataSource({
    type: DATABASE_TYPE,
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    /**
     * 生产环境应当切换为 false
     */
    synchronize: true,
    entities: [Topic,TopicContentSnapshot,TopicStatSnapshot,UserSnapshot,Comments,User],
    /**
     * note: 使用 database 缓存会出现缓存的 result 是 text，导致部分数据获取时建造缓存失败。
     * 因此需要手动更改对应的字段为 longtext
     */
    cache:{
        duration:3000,
        type:'database',
    },
    poolsize:20,
    migrations: [],
    charset: 'utf8mb4',
} as DataSourceOptions)

await GeneralContentDatasource.initialize()