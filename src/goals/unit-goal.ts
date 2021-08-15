import { Goal, GoalQueue, GoalMatrix } from "../goal"
import * as Clauses from "../clauses"
import { Table } from "../table"
import { Ctx } from "../ctx"
import { Logical } from "../api"
import { Subst } from "../subst"

export class UnitGoal<T> extends Goal {
  table: Table<T>
  data: Logical<T>

  constructor(opts: { table: Table<T>; data: Logical<T> }) {
    super()
    this.table = opts.table
    this.data = opts.data
  }

  static create<T>(opts: { table: Table<T>; data: Logical<T> }): UnitGoal<T> {
    return new UnitGoal(opts)
  }

  evaluate(subst: Subst): GoalMatrix {
    const queues: Array<GoalQueue> = []

    for (const clause of this.table.clauses) {
      const newSubst = subst.unify(clause.data, this.data)
      if (newSubst !== null) {
        if (clause instanceof Clauses.Fact) {
          queues.push(new GoalQueue(newSubst, []))
        } else if (clause instanceof Clauses.Rule) {
          const ctx = new Ctx(newSubst)
          queues.push(new GoalQueue(newSubst, clause.premises(ctx)))
        } else {
          throw new Error(`Unknown clause type: ${clause.constructor.name}`)
        }
      }
    }

    return new GoalMatrix(queues)
  }
}
