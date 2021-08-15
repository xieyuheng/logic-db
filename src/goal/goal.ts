import { Subst } from "../subst"

export abstract class Goal {
  // TODO should return goal matrix
  abstract evaluate(subst: Subst): void
}
