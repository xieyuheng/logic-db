import { ty, Schema } from "../.."

export type List<T> = null | { head: T; tail: List<T> }

export function listSchema<T>(itemSchema: Schema<T>): Schema<List<T>> {
  const nullSchema = ty.null()
  const consSchema = ty.object({
    head: itemSchema,
    tail: ty.lazy(() => listSchema(itemSchema)),
  })
  return ty.union(nullSchema, consSchema)
}
