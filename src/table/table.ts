import { Logical } from "../api"
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

  i(data: Logical<T>, premises?: (v: Ctx) => Array<Goal>): void {
    if (premises) {
      this.clauses.push(Clauses.Rule.create({ data, premises }))
    } else {
      this.clauses.push(Clauses.Fact.create({ data }))
    }
  }

  o(data: Logical<T>): Goal {
    return Goals.UnitGoal.create({ table: this, data })
  }

  query(data: Logical<T>, opts?: { limit?: number }): Array<Value> {
    const searching = new Searching([
      new GoalQueue(Subst.create(), [this.o(data)]),
    ])
    return searching.take(opts?.limit || 10).map((subst) => subst.reify(data))
  }
}
