export * from "../table"
export * from "../value"

// NOTE API to build goals

import * as Goals from "../goals"

export const eq = Goals.Unifiable.create
export const ne = Goals.NotUnifiable.create
export const and = Goals.And.create

// NOTE toplevel query
export * from "./query"
export * from "./find"

// NOTE re-export dependencies
export { default as ty, Schema } from "@xieyuheng/ty"
