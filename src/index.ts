export * from "./api"
export * from "./value"
export * from "./table"

// NOTE API to build goals

import * as Goals from "./goals"

export const eq = Goals.Unifiable.create
export const ne = Goals.NotUnifiable.create

// NOTE re-export dependencies

export { default as ty } from "@xieyuheng/ty"
export { Schema } from "@xieyuheng/ty"
