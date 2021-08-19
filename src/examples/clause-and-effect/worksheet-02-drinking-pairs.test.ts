import Logic, { v, ne, ty } from "../.."

const drinks = new Logic.Table({
  name: "drinks",
  schema: ty.object({
    person: ty.string(),
    alcohol: ty.string(),
  }),
})

drinks.i({ person: "john", alcohol: "martini" })
drinks.i({ person: "mary", alcohol: "gin" })
drinks.i({ person: "susan", alcohol: "vodka" })
drinks.i({ person: "john", alcohol: "gin" })
drinks.i({ person: "fred", alcohol: "gin" })
drinks.i({ person: "fred", alcohol: "vodka" })

const pair = new Logic.Table({
  name: "pair",
  schema: ty.object({
    p1: ty.string(),
    p2: ty.string(),
    alcohol: ty.string(),
  }),
})

pair.i({ p1: v`p1`, p2: v`p2`, alcohol: v`alcohol` }, (v) => [
  drinks.o({ person: v`p1`, alcohol: v`alcohol` }),
  drinks.o({ person: v`p2`, alcohol: v`alcohol` }),
  ne(v`p1`, v`p2`),
])

console.log(pair.query({ p1: v`x`, p2: "mary", alcohol: "gin" }))
console.log(pair.query({ p1: v`x`, p2: v`y`, alcohol: "gin" }))
console.log(pair.query({ p1: v`x`, p2: v`y`, alcohol: v`alcohol` }))

Logic.query(
  (v) => [pair.o({ p1: v`x`, p2: v`y`, alcohol: v`alcohol` })],
  ["x", "y"],
  {
    log: true,
  }
)

{
  type Result = { x: string; y: string }
  const results: Array<Result> = Logic.find(
    (v) => [pair.o({ p1: v`x`, p2: v`y`, alcohol: v`alcohol` })],
    { x: ty.string(), y: ty.string() },
    {
      log: true,
    }
  )
}

{
  type Result = { x: string }
  const results: Array<Result> = pair.find(
    { p1: v`x`, p2: v`y`, alcohol: v`alcohol` },
    { x: ty.string() },
    { log: true }
  )
}
