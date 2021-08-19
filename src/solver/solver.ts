import { GoalQueue } from "../goal-queue"
import { Table } from "../table"
import { Goal } from "../goal"
import { Subst } from "../subst"
import {
  Value,
  Logical,
  freshenValue,
  VarFinder,
  createVarFinder,
} from "../value"

// NOTE In implementation, we use array of queues to do search,
//   but we should be thinking in terms of tree instead of queues,
//   only by doing so, we can have a clear understanding of the implementation.

export class Solver<T> {
  queues: Array<GoalQueue>

  constructor(opts: { queues: Array<GoalQueue> }) {
    this.queues = opts.queues
  }

  static forGoals<T>(goals: Array<Goal>): Solver<T> {
    const queues = [new GoalQueue(Subst.create(), goals)]
    return new Solver({ queues })
  }

  next(): Subst | null {
    while (true) {
      const queue = this.queues.shift()
      if (queue === undefined) return null
      const queues = queue.step()
      if (queues === null) return queue.subst
      // NOTE about searching
      // push front |   depth first
      // push back  | breadth first
      this.queues.push(...queues)
    }
  }

  solve(opts: { limit?: number } = {}): Array<Subst> {
    const { limit } = opts

    const solutions = []
    while (limit === undefined || solutions.length < limit) {
      const subst = this.next()
      if (subst === null) break
      solutions.push(subst)
    }

    return solutions
  }
}
