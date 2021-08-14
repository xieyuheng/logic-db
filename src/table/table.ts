import ty from "@xieyuheng/ty"
import { Schema } from "@xieyuheng/ty"

export class Table<T> {
  rows: Array<T> = []
}

// const user = table.create("user", )

// user.fact({ id: 1, name: "xieyuheng"})
// user.fact({ id: 2, name: "xieyuheng"})
