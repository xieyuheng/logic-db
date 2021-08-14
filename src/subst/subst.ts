import { Value, Var } from "../value"

export class Subst {
  // NOTE no side-effect

  private map: Map<Var, Value>

  constructor(map: Map<Var, Value>) {
    this.map = map
  }

  static create(): Subst {
    const map = new Map()
    return new Subst(map)
  }

  clone(): Subst {
    const map = new Map(this.map)
    return new Subst(map)
  }

  extend(v: Var, value: Value): Subst {
    const subst = this.clone()
    subst.map.set(v, value)
    return subst
  }

  find(v: Var): Value | undefined {
    return this.map.get(v)
  }
}
