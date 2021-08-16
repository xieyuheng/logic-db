export * from "./value"
export * from "./table"

export { default as ty } from "@xieyuheng/ty"
export { Schema } from "@xieyuheng/ty"

import * as Goals from "./goals"

export const eq = Goals.Unifiable.create
export const ne = Goals.NotUnifiable.create
