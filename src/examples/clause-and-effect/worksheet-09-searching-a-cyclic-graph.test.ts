import { Table, v } from "../.."
import ty from "@xieyuheng/ty"

const a = new Table({
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

// TODO
