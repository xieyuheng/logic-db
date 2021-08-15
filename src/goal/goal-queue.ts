import { Goal } from "../goal"
import { Subst } from "../subst"

export class GoalQueue {
  subst: Subst
  goals: Array<Goal>

  constructor(subst: Subst, goals: Array<Goal>) {
    this.subst = subst
    this.goals = goals
  }

  step(): Array<GoalQueue> | null {
    const goal = this.goals.shift()
    if (goal === undefined) return null
    const queues = goal.evaluate(this.subst)
    return queues.map(
      // NOTE about searching again
      // push front |   depth first
      // push back  | breadth first
      // NOTE `concat` is like push back
      (queue) => new GoalQueue(queue.subst, this.goals.concat(queue.goals))
    )
  }
}
