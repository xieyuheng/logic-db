import { Table, v, ty } from "../.."

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

affordable.i([v`x`, v`y`], (v) => [
  adjacent.o([v`x`, v`z`]),
  adjacent.o([v`z`, v`y`]),
])

affordable.query([v`to_kent`, "kent"], { log: true })
affordable.query(["sussex", v`to_sussex`], { log: true })
affordable.query([v`x`, v`y`], { log: true })
