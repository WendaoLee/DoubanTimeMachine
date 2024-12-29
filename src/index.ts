import { Effect } from "effect";
import { NodeRuntime } from "@effect/platform-node"
import { DataService,DataServiceLive } from "./lib/service/data.ts";
import { app } from "./server/app.ts";

const program = Effect.gen(function*(){
    const dataService = yield* DataService
    /**
     * 以后再把端口号拆出来配置吧。
     */
    app.listen(2011,() => {
        console.log('Server is running on port 2011')
        // dataService.startCrawler()
    })
}).pipe(
    Effect.provide(DataServiceLive)
)

NodeRuntime.runMain(program)