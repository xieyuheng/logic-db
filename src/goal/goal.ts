import { GoalMatix } from "../goal"
import { Subst } from "../subst"

export abstract class Goal {
  abstract evaluate(subst: Subst): GoalMatix
}
