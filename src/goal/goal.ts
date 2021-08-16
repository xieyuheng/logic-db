import { GoalQueue } from "../goal-queue"
import { Subst } from "../subst"

export abstract class Goal {
  abstract evaluate(subst: Subst): Array<GoalQueue>
}
