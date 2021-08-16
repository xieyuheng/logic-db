import { Goal } from "../goal"
import { GoalQueue } from "../goal-queue"
import { Logical } from "../value"
import { Subst } from "../subst"

export class Unifiable<T> extends Goal {
  left: Logical<T>
  right: Logical<T>

  constructor(left: Logical<T>, right: Logical<T>) {
    super()
    this.left = left
    this.right = right
  }

  static create<T>(left: Logical<T>, right: Logical<T>): Unifiable<T> {
    return new Unifiable(left, right)
  }

  evaluate(subst: Subst): Array<GoalQueue> {
    const newSubst = subst.unify(this.left, this.right)
    if (newSubst !== null) {
      return [new GoalQueue(newSubst, [])]
    } else {
      return []
    }
  }
}
