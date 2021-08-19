import { Goal } from "../goal"
import { GoalQueue } from "../goal-queue"
import { Logical } from "../value"
import { Subst } from "../subst"

export class Or extends Goal {
  goals: Array<Goal>

  constructor(goals: Array<Goal>) {
    super()
    this.goals = goals
  }

  static create(...goals: Array<Goal>): Or {
    return new Or(goals)
  }

  evaluate(subst: Subst): Array<GoalQueue> {
    return this.goals.map((goal) => new GoalQueue(subst, [goal]))
  }
}
