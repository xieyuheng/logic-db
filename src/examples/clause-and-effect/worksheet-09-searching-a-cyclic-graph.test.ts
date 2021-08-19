import Logic, { Logical, v, ne, ty, Schema } from "../.."

const a = new Logic.Table({
  name: "a",
  schema: ty.tuple(ty.string(), ty.string()),
})

a.i(["g", "h"])
a.i(["d", "a"])
a.i(["g", "d"])
a.i(["e", "d"])
a.i(["h", "f"])
a.i(["e", "f"])
a.i(["a", "e"])
a.i(["a", "b"])
a.i(["b", "f"])
a.i(["b", "c"])
a.i(["f", "c"])

// a e d -- in a loop

// we need to avoid searching in a loop

// prepare the lispy list

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

const legal = new Logic.Table({
  name: "legal",
  schema: ty.tuple(ty.string(), listSchema()),
})

legal.i([v`z`, null])
legal.i([v`z`, cons(v`car`, v`cdr`)], (v) => [
  ne(v`z`, v`car`),
  legal.o([v`z`, v`cdr`]),
])

const path = new Logic.Table({
  name: "path",
  schema: ty.tuple(ty.string(), ty.string(), listSchema()),
})

path.i([v`x`, v`x`, v`occurs`])
path.i([v`x`, v`y`, v`occurs`], (v) => [
  a.o([v`x`, v`z`]),
  legal.o([v`z`, v`occurs`]),
  path.o([v`z`, v`y`, cons(v`z`, v`occurs`)]),
])

path.query(["f", "f", null], { log: true })
path.query(["a", "c", null], { log: true })
path.query(["g", "e", null], { log: true })

path.query(["g", v`x`, null], { log: true })
path.query([v`x`, "h", null], { log: true })

path.query(["g", "c", null], { log: true })
path.query(["g", "c", cons("f", null)], { log: true })

path.query(["a", v`x`, cons("f", cons("d", null))], { log: true })
path.query(["a", v`x`, null], { log: true })
