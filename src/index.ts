export * from "./value"
export * from "./table"

import * as Goals from "./goals"

export const eq = Goals.Unifiable.create
export const ne = Goals.NotUnifiable.create
