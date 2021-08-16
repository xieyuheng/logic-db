import { Goal } from "../goal"
import { GoalQueue } from "../goal-queue"
import * as Clauses from "../clauses"
import { Table } from "../table"
import { Var, extractVars, freshenValue } from "../value"
import { Ctx } from "../ctx"
import { Logical, VariableFinder } from "../value"
import { Subst } from "../subst"

export class Relation<T> extends Goal {
  table: Table<T>
  data: Logical<T>

  constructor(opts: { table: Table<T>; data: Logical<T> }) {
    super()
    this.table = opts.table
    this.data = opts.data
  }

  static create<T>(opts: { table: Table<T>; data: Logical<T> }): Relation<T> {
    return new Relation(opts)
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
          const vars = extractVars(data)
          const v = createVariableFinder(vars)
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

// NOTE side-effect on vars
function createVariableFinder(vars: { [key: string]: Var }): VariableFinder {
  return (strs) => {
    const found = vars[strs[0]]
    if (found !== undefined) {
      return found
    } else {
      const variable = new Var(strs[0])
      vars[variable.name] = variable
      return variable
    }
  }
}
