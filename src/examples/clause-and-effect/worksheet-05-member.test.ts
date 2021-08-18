import { Logical, Table, v, ty, Schema, Var } from "../.."

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

const member = new Table({
  name: "member",
  schema: ty.tuple(ty.string(), listSchema(ty.string())),
})

member.i([v`element`, { head: v`element`, tail: v`tail` }])
member.i([v`element`, { head: v`head`, tail: v`tail` }], (v) => [
  member.o([v`element`, v`tail`]),
])

member.assert(["john", { head: "paul", tail: { head: "john", tail: null } }])
member.assertNot([
  "joe",
  {
    head: "marx",
    tail: {
      head: "darwin",
      tail: {
        head: "freud",
        tail: null,
      },
    },
  },
])

member.assertResults(
  [v`element`, { head: "paul", tail: { head: "john", tail: null } }],
  [
    ["paul", { head: "paul", tail: { head: "john", tail: null } }],
    ["john", { head: "paul", tail: { head: "john", tail: null } }],
  ]
)

{
  const results = member.query(["foo", v`list`], { limit: 3 })
  for (const result of results) {
    console.log(JSON.stringify(result))
  }
}
