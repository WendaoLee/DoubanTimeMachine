import { Effect } from "effect"
import { getUserSnapshotFeatureByGroupAPI } from "@/lib/combinators/api/index.ts"
import { processUserSnapshot } from "@/lib/combinators/database/index.ts"
import { UserSnapshotFeature } from "@/types/feature/UserSnapshotFeature.ts"

const t =  Effect.gen(function*(){
    console.log('1')
    const userSnapshotFeatures = yield* getUserSnapshotFeatureByGroupAPI('728957')
    const effOfProcessUserSnapshot = userSnapshotFeatures.map(processUserSnapshot)
    const userSnapshot = yield* Effect.all(effOfProcessUserSnapshot)
    return userSnapshot
})

const g = Effect.gen(function*(){
    console.log('1')
    const userSnapshotFeatures = yield* getUserSnapshotFeatureByGroupAPI('728957')
    const effOfProcessUserSnapshot = userSnapshotFeatures.map(processUserSnapshot)
    const userSnapshot = yield* Effect.all(effOfProcessUserSnapshot)
    return userSnapshot
})

const eff = Effect.Do.pipe(
    Effect.bind('userSnapshotFeature',() => getUserSnapshotFeatureByGroupAPI('728957')),
    Effect.let('nothio',()=>{console.log('1')}),
    Effect.flatMap(({userSnapshotFeature}) => Effect.all(userSnapshotFeature.map(processUserSnapshot))),
    Effect.map(() => console.log('done')),
    Effect.tapError((e) => Effect.logError(e))
)

console.log('2')

const d = await Effect.runPromise(eff)

console.log(d)
