import { GoalQueue } from "../goal-queue"
import { Table } from "../table"
import { Goal } from "../goal"
import { Subst } from "../subst"
import {
  Value,
  Logical,
  freshenValue,
  VariableFinder,
  createVariableFinder,
} from "../value"

export type SolverOptions = {
  limit?: number
  log?: boolean
}

// NOTE In implementation, we use array of queues to do search,
//   but we should be thinking in terms of tree instead of queues,
//   only by doing so, we can have a clear understanding of the implementation.

export class Solver<T> {
  queues: Array<GoalQueue>
  limit?: number
  count: number = 0

  constructor(
    input: {
      queues: Array<GoalQueue>
    },
    opts: SolverOptions
  ) {
    this.queues = input.queues
    this.limit = opts.limit
  }

  static forGoals<T>(goals: Array<Goal>, opts: SolverOptions): Solver<T> {
    const queues = [new GoalQueue(Subst.create(), goals)]
    return new Solver({ queues }, opts)
  }

  next(): Subst | null {
    while (true) {
      if (this.limit !== undefined && this.count === this.limit) return null
      const queue = this.queues.shift()
      if (queue === undefined) return null
      const queues = queue.step()
      if (queues === null) {
        this.count++
        return queue.subst
      }
      // NOTE about searching
      // push front |   depth first
      // push back  | breadth first
      this.queues.push(...queues)
    }
  }

  solve(): Array<Subst> {
    const solutions = []
    while (true) {
      const subst = this.next()
      if (subst === null) break
      solutions.push(subst)
    }

    return solutions
  }
}
