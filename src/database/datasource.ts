import 'reflect-metadata'
import { DatabaseType, DataSource, DataSourceOptions } from "typeorm"
import { DATABASE_TYPE, DATABASE_HOST, DATABASE_PORT, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } from "@/lib/constants/DATABASE.ts"
import { Topic } from "./entity/Topic.ts"
import { TopicContentSnapshot } from "./entity/TopicContentSnapshot.ts"
import { TopicStatSnapshot } from "./entity/TopicStatSnapshot.ts"
import { UserSnapshot } from "./entity/UserSnapshot.ts"
import { Reply } from './entity/Reply.ts'
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
    entities: [Topic,TopicContentSnapshot,TopicStatSnapshot,UserSnapshot,Reply,User],
    migrations: []
} as DataSourceOptions)

await GeneralContentDatasource.initialize()