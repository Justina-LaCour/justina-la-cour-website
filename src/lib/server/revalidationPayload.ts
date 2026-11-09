import * as v from "valibot";

const ResourceSelectionSchema = v.union([
    v.literal("all"),
    v.array(v.pipe(v.string(), v.nonEmpty()))
]);

export const RevalidationPayloadSchema = v.union([
    v.strictObject({
        resources: v.record(v.string(), ResourceSelectionSchema)
    }),
    v.strictObject({
        pages: v.literal("all")
    })
]);
