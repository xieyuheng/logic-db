import { Goal } from "../goal"
import { Subst } from "../subst"

export class GoalQueue {
  subst: Subst
  goals: Array<Goal>

  constructor(subst: Subst, goals: Array<Goal>) {
    this.subst = subst
    this.goals = goals
  }
}
