import { Logical, Table, v, ty, Schema, Var } from "../.."

// prepare the lispy list

type List<T> = null | { head: T | Var; tail: List<T> | Var }

function cons<T>(head: T | Var, tail: List<T> | Var): List<T> {
  return { head, tail }
}

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

member.i([v`element`, cons(v`element`, v`tail`)])
member.i([v`element`, cons(v`head`, v`tail`)], (v) => [
  member.o([v`element`, v`tail`]),
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
