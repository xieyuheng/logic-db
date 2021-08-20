import Logic, { Logical, v, ty, Schema, Var } from "../.."
import { List, listSchema } from "./list"

const member = new Logic.Table({
  name: "member",
  schema: ty.tuple(ty.string(), listSchema(ty.string())),
})

member.i([v`element`, { head: v`element`, tail: v`tail` }])
member.i([v`element`, { head: v`head`, tail: v`tail` }], (v) => [
  member.o([v`element`, v`tail`]),
])

member.assertFound([
  "john",
  { head: "paul", tail: { head: "john", tail: null } },
])
member.assertNotFound([
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

member.assertQueryResults({
  data: [v`element`, { head: "paul", tail: { head: "john", tail: null } }],
  results: [
    ["paul", { head: "paul", tail: { head: "john", tail: null } }],
    ["john", { head: "paul", tail: { head: "john", tail: null } }],
  ],
})

{
  const results = member.query(["foo", v`list`], { limit: 3 })
  for (const result of results) {
    console.log(JSON.stringify(result))
  }
}
