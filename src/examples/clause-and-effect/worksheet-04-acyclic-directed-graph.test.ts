import { Table, v, ty } from "../.."

const a = new Table({
  name: "a",
  schema: ty.tuple(ty.string(), ty.string()),
})

a.i(["g", "h"])
a.i(["g", "d"])
a.i(["e", "d"])
a.i(["h", "f"])
a.i(["e", "f"])
a.i(["a", "e"])
a.i(["a", "b"])
a.i(["b", "f"])
a.i(["b", "c"])
a.i(["f", "c"])

const path = new Table({
  name: "path",
  schema: ty.tuple(ty.string(), ty.string()),
})

path.i([v`x`, v`x`])
path.i([v`x`, v`y`], (v) => [a.o([v`x`, v`z`]), path.o([v`z`, v`y`])])

path.find(["g", v`x`], { log: true })
path.find([v`x`, "h"], { log: true })
path.find([v`x`, v`y`], { log: true })
