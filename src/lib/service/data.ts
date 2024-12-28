import { Context, Effect, Layer } from "effect";

/**
 * 从豆瓣获取数据&存储数据&获取已存储的数据都通过该层进行数据的交互。
 */
export class DataService extends Context.Tag('DataService')<
    DataService,
    {
        /**
         * 在数据层启动爬虫
         * @returns 
         */
        readonly startCrawler: () => void
    }
>() {}
