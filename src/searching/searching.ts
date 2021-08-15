import { GoalMatix } from "../goal"
import { Subst } from "../subst"

export class Searching {
  matrix: GoalMatix

  constructor(matrix: GoalMatix) {
    this.matrix = matrix
  }

  next(): Subst | null {
    while (true) {
      const queue = this.matrix.queues.shift()
      if (queue === undefined) return null
      const matrix = queue.step()
      if (matrix === null) return queue.subst
      // NOTE about searching
      // push front |   depth first
      // push back  | breadth first
      this.matrix.queues.push(...matrix.queues)
    }
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
