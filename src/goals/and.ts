import { Goal } from "../goal"
import { GoalQueue } from "../goal-queue"
import { Logical } from "../value"
import { Subst } from "../subst"

export class And extends Goal {
  goals: Array<Goal>

  constructor(goals: Array<Goal>) {
    super()
    this.goals = goals
  }

  static create(...goals: Array<Goal>): And {
    return new And(goals)
  }

  evaluate(subst: Subst): Array<GoalQueue> {
    return [new GoalQueue(subst, this.goals)]
  }
}
