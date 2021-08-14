import { Value, Var, isObject } from "../value"

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

  walk(value: Value): Value {
    while (value instanceof Var) {
      const found = this.find(value)
      if (found === undefined) {
        return value
      } else {
        value = found
      }
    }

    return value
  }

  occur(v: Var, value: Value): boolean {
    value = this.walk(value)

    if (value instanceof Var) {
      return value === v
    } else if (value instanceof Array) {
      for (let e of value) {
        if (this.occur(v, e)) {
          return true
        }
      }
      return false
    } else if (isObject(value)) {
      for (let k in value) {
        if (this.occur(v, value[k])) {
          return true
        }
      }
      return false
    } else {
      return false
    }
  }
}
