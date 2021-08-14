import { Logical } from "../api"
import ty from "@xieyuheng/ty"
import { Schema } from "@xieyuheng/ty"

export class Table<T> {
  private rows: Array<Logical<T>> = []

  name: string
  schema: Schema<T>

  constructor(opts: { name: string; schema: Schema<T> }) {
    this.name = opts.name
    this.schema = opts.schema
  }

  static create<T>(opts: { name: string; schema: Schema<T> }): Table<T> {
    const { name, schema } = opts
    return new Table({ name, schema })
  }

  i(data: Logical<T>): void {
    this.rows.push(data)
  }
}
