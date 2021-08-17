import { Logical, Table, v, eq, ty, Schema } from "../.."

// prepare the lispy list

type List =
  | string
  | number
  | null
  | {
      car: List
      cdr: List
    }

function cons(car: Logical<List>, cdr: Logical<List>): Logical<List> {
  return { car, cdr }
}

function listSchema(): Schema<List> {
  return ty.union(
    ty.union(ty.string(), ty.number()),
    // TODO ty can not handle recursive schema
    // ty.union(ty.null(), ty.object({ car: listSchema(), cdr: listSchema() }))
    ty.union(ty.null(), ty.object({ car: ty.any(), cdr: ty.any() }))
  )
}

// prepare the nat
//   for we can not deal with native js number logically yet ...
//   this should be fixed by constraint programming.
//   I am apologize for this, and I will fix this soon.

type Nat = "zero" | { prev: Nat }

const zero: Nat = "zero"

function succ(n: Logical<Nat>): Logical<Nat> {
  return { prev: n }
}

function natSchema(): Schema<Nat> {
  const zeroSchema = ty.same("zero" as const)
  const succSchema = ty.object({ prev: ty.lazy(natSchema) })
  return ty.union(zeroSchema, succSchema)
}

const length = new Table({
  name: "length",
  schema: ty.tuple(listSchema(), natSchema()),
})

length.i([null, zero])

length.i([cons(v`car`, v`cdr`), v`length`], (v) => [
  length.o([v`cdr`, v`cdr_length`]),
  eq(v`length`, succ(v`cdr_length`)),
])

length.assertResults(
  [cons("apple", cons("pear", null)), v`length`],
  [[cons("apple", cons("pear", null)), succ(succ("zero"))]]
)

length.find([v`list`, succ(succ(zero))], { log: true })
