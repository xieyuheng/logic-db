import { GoalQueue } from "../goal"
import { Table } from "../table"
import { Subst } from "../subst"
import { Logical } from "../value"

export class Searching<T> {
  table: Table<T>
  queues: Array<GoalQueue>
  data: Logical<T>
  log: boolean

  constructor(opts: {
    table: Table<T>
    queues: Array<GoalQueue>
    data: Logical<T>
    log?: boolean
  }) {
    this.table = opts.table
    this.queues = opts.queues
    this.data = opts.data
    this.log = opts.log || false
  }

  static forData<T>(
    table: Table<T>,
    data: Logical<T>,
    opts: { log?: boolean }
  ): Searching<T> {
    const { log } = opts

    const queues = [new GoalQueue(Subst.create(), [table.o(data)])]
    const searching = new Searching({ table, data, queues, log })

    return searching
  }

  count = 0

  next(): Subst | null {
    while (true) {
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
            count: this.count++,
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

  all(): Array<Subst> {
    const array = []
    while (true) {
      let subst = this.next()
      if (subst === null) {
        break
      } else {
        array.push(subst)
      }
    }

    return array
  }

  take(limit: number): Array<Subst> {
    const array = []
    while (limit > 0) {
      let subst = this.next()
      if (subst === null) {
        break
      } else {
        array.push(subst)
      }
      limit--
    }

    return array
  }
}
