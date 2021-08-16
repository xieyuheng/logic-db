import { GoalQueue } from "../goal"
import { Subst } from "../subst"

export class Searching {
  queues: Array<GoalQueue>

  constructor(queues: Array<GoalQueue>) {
    this.queues = queues
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
