import { Logical, Table, v, eq } from "../.."
import ty from "@xieyuheng/ty"
import { Schema } from "@xieyuheng/ty"

// prepare the lispy list

type List =
  | string
  | number
  | null
  | {
      car: List
      cdr: List
    }

function cons(car: List, cdr: List): List {
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
  // TODO ty can not handle recursive schema
  // ty.union(ty.same("zero"), ty.object({ prev: natSchema() }))
  return ty.union(ty.same("zero"), ty.object({ prev: ty.any() }))
}

const length = new Table({
  name: "length",
  schema: ty.tuple(listSchema(), natSchema()),
})

length.i([null, zero])

length.i([{ car: v`car`, cdr: v`cdr` }, v`length`], (v) => [
  length.o([v`cdr`, v`cdr_length`]),
  eq(v`length`, succ(v`cdr_length`)),
])

length.assertResults(
  [cons("apple", cons("pear", null)), v`length`],
  [[cons("apple", cons("pear", null)), succ(succ("zero"))]]
)

length.find([v`list`, succ(succ(zero))], { log: true })
