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

export type SearchOptions = {
  limit?: number
  log?: boolean
}

// NOTE In implementation, we use array of queues to do search,
//   but we should be thinking in terms of tree instead of queues,
//   only by doing so, we can have a clear understanding of the implementation.

export class Searching<T> {
  table?: Table<T>
  queues: Array<GoalQueue>
  data: Logical<T>
  limit?: number
  count: number = 0

  constructor(
    input: {
      table?: Table<T>
      queues: Array<GoalQueue>
      data: Logical<T>
    },
    opts: SearchOptions
  ) {
    this.table = input.table
    this.queues = input.queues
    this.data = input.data
    this.limit = opts.limit
  }

  static forData<T>(
    table: Table<T>,
    data: Logical<T>,
    opts: SearchOptions
  ): Searching<T> {
    data = freshenValue(data) as Logical<T>
    const queues = [new GoalQueue(Subst.create(), [table.o(data)])]
    const searching = new Searching({ table, data, queues }, opts)
    return searching
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

  find(): Array<Logical<T>> {
    const results = []
    while (true) {
      let subst = this.next()
      if (subst === null) break
      const result = subst.reify(this.data) as Logical<T>
      results.push(result)
    }

    return results
  }
}
