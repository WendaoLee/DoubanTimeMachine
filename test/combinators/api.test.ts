import { getUserSnapshotFeatureByGroupAPI } from "@/lib/combinators/api/index.ts"
import { Effect } from "effect"

describe('getUserSnapshotFeatureByGroupAPI',() => {
    it('should return user snapshot feature',async () => {
        const d = await Effect.runPromise(getUserSnapshotFeatureByGroupAPI('728957'))
        expect(d).toBeDefined()
    })
})
