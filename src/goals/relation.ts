import { Goal } from "../goal"
import { GoalQueue } from "../goal-queue"
import * as Clauses from "../clauses"
import { Table } from "../table"
import { Var, freshenValue } from "../value"
import { Ctx } from "../ctx"
import { Logical, VarFinder } from "../value"
import { Subst } from "../subst"

export class Relation<T> extends Goal {
  table: Table<T>
  data: Logical<T>

  constructor(opts: { table: Table<T>; data: Logical<T> }) {
    super()
    this.table = opts.table
    this.data = opts.data
  }

  evaluate(subst: Subst): Array<GoalQueue> {
    const queues: Array<GoalQueue> = []

    for (const clause of this.table.clauses) {
      const data = freshenValue(clause.data)
      const newSubst = subst.unify(data, this.data)
      if (newSubst !== null) {
        if (clause instanceof Clauses.Fact) {
          queues.push(new GoalQueue(newSubst, []))
        } else if (clause instanceof Clauses.Rule) {
          const v = Var.createVarFinder(Var.extractVarMap(data))
          const ctx = new Ctx(newSubst)
          queues.push(new GoalQueue(newSubst, clause.premises(v, ctx)))
        } else {
          throw new Error(`Unknown clause type: ${clause.constructor.name}`)
        }
      }
    }

    return queues
  }
}
