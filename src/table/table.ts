import { Logical, VariableFinder } from "../value"
import { Searching } from "../searching"
import { Ctx } from "../ctx"
import { Clause } from "../clause"
import { Subst } from "../subst"
import { Value } from "../value"
import { Goal, GoalQueue } from "../goal"
import * as Goals from "../goals"
import * as Clauses from "../clauses"
import ty from "@xieyuheng/ty"
import { Schema } from "@xieyuheng/ty"

export class Table<T> {
  clauses: Array<Clause<T>> = []
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

  i(
    data: Logical<T>,
    premises?: (v: VariableFinder, ctx: Ctx) => Array<Goal>
  ): void {
    if (premises) {
      this.clauses.push(Clauses.Rule.create({ data, premises }))
    } else {
      this.clauses.push(Clauses.Fact.create({ data }))
    }
  }

  o(data: Logical<T>): Goal {
    return Goals.UnitGoal.create({ table: this, data })
  }

  find(data: Logical<T>, opts: QueryOptions = {}): Array<Logical<T>> {
    const { limit, log } = opts

    const searching = Searching.forData(this, data, { log })

    if (limit) {
      const results = searching.take(limit).map((subst) => subst.reify(data))
      return results as Array<Logical<T>>
    } else {
      const results = searching.all().map((subst) => subst.reify(data))
      return results as Array<Logical<T>>
    }
  }

  get(data: Logical<T>): Logical<T> | undefined {
    const [result] = this.find(data, { limit: 1 })
    return result
  }

  assert(data: Logical<T>): void {
    const result = this.get(data)
    if (result === undefined) {
      throw new Error(
        [
          `An assertion is made that the data is in the table,`,
          `but it is actually not in the table.`,
          `  table: ${this.name}`,
          `  data: ${JSON.stringify(data)}`,
        ].join("\n")
      )
    }
  }

  assertNot(data: Logical<T>): void {
    const result = this.get(data)
    if (result !== undefined) {
      throw new Error(
        [
          `An assertion is made that the data is **not** in the table,`,
          `but it is actually in the table.`,
          `  table: ${this.name}`,
          `  data: ${JSON.stringify(data)}`,
        ].join("\n")
      )
    }
  }
}

export type QueryOptions = {
  limit?: number
  log?: boolean
}
