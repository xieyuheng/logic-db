import ty from "@xieyuheng/ty"
import { p } from "../api"
import { Table } from "../table"

const user = Table.create({
  name: "user",
  schema: ty.object({
    id: ty.number(),
    name: ty.string(),
  }),
})

user.i({ id: 1, name: "xieyuheng" })
user.i({ id: 2, name: p`name` })
