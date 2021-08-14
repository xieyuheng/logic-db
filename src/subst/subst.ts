import { Value, Var } from "../value"

export class Subst {
  // NOTE no side-effect

  map: Map<Value, Value>

  constructor(map: Map<Value, Value>) {
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
}
