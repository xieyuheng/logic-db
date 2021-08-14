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

// user.i({ id: 1, name: p`x` }, (v) => [
//   { id: 1, name: v`x` },
//   { id: 1, name: v`x` },
// ])

const users = Table.create({
  name: "users",
  schema: ty.array(
    ty.object({
      id: ty.number(),
      name: ty.string(),
    })
  ),
})

users.i([
  { id: 1, name: "xieyuheng" },
  { id: 2, name: "yuhengxie" },
  { id: p`id`, name: p`name` },
  p`user`,
])
