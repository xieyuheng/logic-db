import { Value, Var, isObject } from "../value"
import * as ut from "../ut"

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
    xs: { [key: string]: Value },
    ys: { [key: string]: Value }
  ): Subst | null {
    if (Object.keys(xs).length >= Object.keys(ys).length) {
      return this.coverObject(xs, ys)
    } else {
      return this.coverObject(ys, xs)
    }
  }

  private coverObject(
    xs: { [key: string]: Value },
    ys: { [key: string]: Value }
  ): Subst | null {
    let subst: Subst | null = this

    for (let k in ys) {
      if (xs[k] === undefined) {
        return null
      }

      subst = subst.unify(xs[k], ys[k])
      if (subst === null) {
        return null
      }
    }

    return subst
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

  deepWalk(x: Value): Value {
    x = this.walk(x)

    if (x instanceof Var) {
      return x
    } else if (x instanceof Array) {
      return x.map((e) => this.deepWalk(e))
    } else if (isObject(x)) {
      const y: { [key: string]: Value } = {}
      for (let k in x) {
        y[k] = this.deepWalk(x[k])
      }
      return y
    } else {
      return x
    }
  }

  reify(x: Value): Value {
    return this.deepWalk(x)
  }

  // NOTE for testing
  assertSuccess(v: Var, value: Value): void {
    const found = this.find(v)

    if (found === undefined) {
      throw new Error([`I can not find var: ${JSON.stringify(v)}`].join("\n"))
    }

    if (!ut.equal(found, value)) {
      throw new Error(
        [
          `I expect to found value: ${JSON.stringify(value)}`,
          `  var: ${JSON.stringify(v)}`,
          `  found: ${JSON.stringify(found)}`,
        ].join("\n")
      )
    }
  }
}
