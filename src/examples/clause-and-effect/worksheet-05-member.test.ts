import { Table, v } from "../.."
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

const member = new Table({
  name: "member",
  schema: ty.tuple(listSchema(), listSchema()),
})

member.i([v`element`, { car: v`element`, cdr: v`cdr` }])
member.i([v`element`, { car: v`car`, cdr: v`cdr` }], (v) => [
  member.o([v`element`, v`cdr`]),
])

member.assert(["john", cons("paul", cons("john", null))])
member.assertNot(["joe", cons("marx", cons("darwin", cons("freud", null)))])

member.assertResults(
  [v`element`, cons("paul", cons("john", null))],
  [
    ["paul", cons("paul", cons("john", null))],
    ["john", cons("paul", cons("john", null))],
  ]
)

{
  const results = member.find(["foo", v`list`], { limit: 3 })
  for (const result of results) {
    console.log(JSON.stringify(result))
  }
}
