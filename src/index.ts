export * from "./value"
export * from "./table"

import * as Goals from "./goals"

export const u = Goals.Unifiable.create
export const nu = Goals.NotUnifiable.create
