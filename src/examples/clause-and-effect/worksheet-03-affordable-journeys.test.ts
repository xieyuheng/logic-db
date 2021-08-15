import { Table, v } from "../.."
import ty from "@xieyuheng/ty"

const border = new Table({
  name: "border",
  schema: ty.tuple(ty.string(), ty.string()),
})

border.i(["sussex", "kent"])
border.i(["sussex", "surrey"])
border.i(["surrey", "kent"])
border.i(["hampshire", "sussex"])
border.i(["hampshire", "surrey"])
border.i(["hampshire", "berkshire"])
border.i(["berkshire", "surrey"])
border.i(["wiltshire", "hampshire"])
border.i(["wiltshire", "berkshire"])

// to get symmetry

const adjacent = new Table({
  name: "adjacent",
  schema: ty.tuple(ty.string(), ty.string()),
})

adjacent.i([v`x`, v`y`], (v) => [border.o([v`x`, v`y`])])
adjacent.i([v`x`, v`y`], (v) => [border.o([v`y`, v`x`])])

const affordable = new Table({
  name: "affordable",
  schema: ty.tuple(ty.string(), ty.string()),
})

// TODO wrong results

affordable.i([v`x`, v`y`], (v) => {
  const z = v`z`
  return [adjacent.o([v`x`, z]), adjacent.o([z, v`y`])]
})

console.log(affordable.query([v`to-kent`, "kent"]))
console.log(affordable.query(["sussex", v`to-sussex`]))
console.log(affordable.query([v`x`, v`y`]))
