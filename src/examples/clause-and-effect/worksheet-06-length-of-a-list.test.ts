import { Logical, Table, v, eq, ty, Schema } from "../.."

// prepare the lispy list

type List<T> = null | { head: T; tail: List<T> }

function listSchema<T>(itemSchema: Schema<T>): Schema<List<T>> {
  const nullSchema = ty.null()
  const consSchema = ty.object({
    head: itemSchema,
    tail: ty.lazy(() => listSchema(itemSchema)),
  })
  return ty.union(nullSchema, consSchema)
}

// prepare the nat
//   for we can not deal with native js number logically yet ...
//   this should be fixed by constraint programming.
//   I am apologize for this, and I will fix this soon.

type Nat = "zero" | { prev: Nat }

const zero: Nat = "zero"

function natSchema(): Schema<Nat> {
  const zeroSchema = ty.const("zero" as const)
  const succSchema = ty.object({ prev: ty.lazy(natSchema) })
  return ty.union(zeroSchema, succSchema)
}

const length = new Table({
  name: "length",
  schema: ty.tuple(listSchema(ty.string()), natSchema()),
})

length.i([null, zero])

length.i([{ head: v`head`, tail: v`tail` }, v`length`], (v) => [
  length.o([v`tail`, v`tail_length`]),
  eq(v`length`, { prev: v`tail_length` }),
])

length.assertResults(
  [{ head: "apple", tail: { head: "pear", tail: null } }, v`length`],
  [
    [
      { head: "apple", tail: { head: "pear", tail: null } },
      { prev: { prev: "zero" } },
    ],
  ]
)

length.query([v`list`, { prev: { prev: "zero" } }], { log: true })
