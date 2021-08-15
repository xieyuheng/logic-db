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
      if (!matrix) return queue.subst
      for (const queue of matrix.queues) {
        //// about searching
        // push front |   depth first
        // push back  | breadth first
        this.matrix.queues.push(queue)
      }
    }
  }

  take(limit: number): Array<Subst> {
    return []
  }
}
