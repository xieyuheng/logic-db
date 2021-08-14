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

  unify(x: Value, y: Value): Subst | null {
    x = this.walk(x)
    y = this.walk(y)

    if (x instanceof Var && y instanceof Var && x === y) {
      return this
    } else if (x instanceof Var) {
      if (this.occur(x, y)) {
        return null
      } else {
        return this.extend(x, y)
      }
    } else if (y instanceof Var) {
      if (this.occur(y, x)) {
        return null
      } else {
        return this.extend(y, x)
      }
    } else if (x instanceof Array && y instanceof Array) {
      return this.unifyArray(x, y)
    } else if (isObject(x) && isObject(y)) {
      return this.unifyObject(x, y)
    } else if (x === y) {
      return this
    } else {
      return null
    }
  }

  private unifyObject(
    x: { [key: string]: Value },
    y: { [key: string]: Value }
  ): Subst | null {
    if (Object.keys(x).length >= Object.keys(y).length) {
      return this.coverObject(x, y)
    } else {
      return this.coverObject(y, x)
    }
  }

  private coverObject(
    x: { [key: string]: Value },
    y: { [key: string]: Value }
  ): Subst | null {
    throw new Error("TODO")
  }

  private unifyArray(xs: Array<Value>, ys: Array<Value>): Subst | null {
    let subst: Subst | null = this

    if (xs.length !== ys.length) {
      return null
    }

    let i = 0
    while (i < xs.length) {
      subst = subst.unify(xs[i], ys[i])
      if (subst === null) {
        return null
      } else {
        i++
      }
    }

    return subst
  }
}
