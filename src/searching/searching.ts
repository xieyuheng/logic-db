import { GoalQueue } from "../goal-queue"
import { Table } from "../table"
import { Subst } from "../subst"
import { Logical } from "../value"

export type SearchOptions = {
  limit?: number
  log?: boolean
}

export class Searching<T> {
  table: Table<T>
  queues: Array<GoalQueue>
  data: Logical<T>
  limit?: number
  log: boolean
  count: number = 0

  constructor(
    input: {
      table: Table<T>
      queues: Array<GoalQueue>
      data: Logical<T>
    },
    opts: SearchOptions
  ) {
    this.table = input.table
    this.queues = input.queues
    this.data = input.data
    this.limit = opts.limit
    this.log = opts.log || false
  }

  static forData<T>(
    table: Table<T>,
    data: Logical<T>,
    opts: SearchOptions
  ): Searching<T> {
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
        if (this.log) {
          const result = queue.subst.reify(this.data)
          console.log({
            table: this.table.name,
            data: this.data,
            result,
            limit: this.limit,
            count: ++this.count,
          })
        }
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
