import { Subst } from "../subst"

export class Ctx {
  subst: Subst

  constructor(subst: Subst) {
    this.subst = subst
  }
}
