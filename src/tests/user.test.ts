import ty from "@xieyuheng/ty"
import { Table } from "../table"

const user = Table.create({
  name: "user",
  schema: ty.object({
    id: ty.number(),
    name: ty.string(),
  }),
})

user.i({ id: 1, name: "xieyuheng" })
user.i({ id: 2, name: "xieyuheng" })

// user.relation({ id: 1, name: p("x") }, (v) => [
//   { id: 1, name: p("x") },
//   { id: 1, name: p("x") },
// ])
