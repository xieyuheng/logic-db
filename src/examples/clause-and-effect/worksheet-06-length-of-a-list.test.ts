import Logic, { Logical, v, eq, ty, Schema } from "../.."
import { List, listSchema } from "./list"
import { Nat, natSchema, zero } from "./nat"

const length = new Logic.Table({
  name: "length",
  schema: ty.tuple(listSchema(ty.string()), natSchema()),
})

length.i([null, zero])

length.i([{ head: v`head`, tail: v`tail` }, v`length`], (v) => [
  length.o([v`tail`, v`tail_length`]),
  eq(v`length`, { prev: v`tail_length` }),
])

length.assertFindResults({
  data: [{ head: "apple", tail: { head: "pear", tail: null } }, v`length`],
  projections: {
    length: natSchema(),
  },
  results: [{ length: { prev: { prev: "zero" } } as Nat }],
})

console.log(length.query([v`list`, "zero"]))
console.log(length.query([v`list`, { prev: "zero" }]))
console.log(length.query([v`list`, { prev: { prev: "zero" } }]))
