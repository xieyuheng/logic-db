import { Table, v } from "../.."
import ty from "@xieyuheng/ty"

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

console.log(path.find(["g", v`x`]))
console.log(path.find([v`x`, "h"]))
console.log(path.find([v`x`, v`y`]))
