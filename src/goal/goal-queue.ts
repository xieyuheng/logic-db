import { Goal, GoalMatix } from "../goal"
import { Subst } from "../subst"

export class GoalQueue {
  subst: Subst
  goals: Array<Goal>

  constructor(subst: Subst, goals: Array<Goal>) {
    this.subst = subst
    this.goals = goals
  }

  step(): GoalMatix | null {
    const goal = this.goals.shift()
    if (goal === undefined) return null
    const matrix = goal.evaluate(this.subst)
    const queues = []
    for (const queue of matrix.queues) {
      queues.push(
        new GoalQueue(
          queue.subst,
          // NOTE about searching again
          // push front |   depth first
          // push back  | breadth first
          this.goals.concat(queue.goals)
        )
      )
    }

    return new GoalMatix(queues)
  }
}
