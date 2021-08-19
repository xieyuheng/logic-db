import Logic, { Logical, v, ne, ty, Schema } from "../.."
import { List, listSchema } from "./list"

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

const legal = new Logic.Table({
  name: "legal",
  schema: ty.tuple(ty.string(), listSchema(ty.string())),
})

legal.i([v`z`, null])
legal.i([v`z`, { head: v`head`, tail: v`tail` }], (v) => [
  ne(v`z`, v`head`),
  legal.o([v`z`, v`tail`]),
])

const path = new Logic.Table({
  name: "path",
  schema: ty.tuple(ty.string(), ty.string(), listSchema(ty.string())),
})

path.i([v`x`, v`x`, v`occurs`])
path.i([v`x`, v`y`, v`occurs`], (v) => [
  a.o([v`x`, v`z`]),
  legal.o([v`z`, v`occurs`]),
  path.o([v`z`, v`y`, { head: v`z`, tail: v`occurs` }]),
])

path.query(["f", "f", null], { log: true })
path.query(["a", "c", null], { log: true })
path.query(["g", "e", null], { log: true })

path.query(["g", v`x`, null], { log: true })
path.query([v`x`, "h", null], { log: true })

path.query(["g", "c", null], { log: true })
path.query(["g", "c", { head: "f", tail: null }], { log: true })

path.query(["a", v`x`, { head: "f", tail: { head: "d", tail: null } }], {
  log: true,
})
path.query(["a", v`x`, null], { log: true })
