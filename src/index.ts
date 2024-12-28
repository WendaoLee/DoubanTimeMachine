import { Effect } from "effect";
import { NodeRuntime } from "@effect/platform-node"
import { DataService,DataServiceLive } from "./lib/service/data.ts";

const program = Effect.gen(function*(){
    const dataService = yield* DataService
    dataService.startCrawler()
}).pipe(
    Effect.provide(DataServiceLive)
)

NodeRuntime.runMain(program)