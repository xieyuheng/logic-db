import { Value, isObject } from "../value"

export type Logical<T> = Var | { [P in keyof T]: Logical<T[P]> }

export type VarFinder = (strs: TemplateStringsArray) => Var

export class Var {
  id: number
  name: string

  static counter = 0

  constructor(name: string) {
    this.id = Var.counter++
    this.name = name
  }

  // NOTE side-effect on map
  static createVarFinder(map: Map<string, Var>): VarFinder {
    return (strs) => {
      const found = map.get(strs[0])
      if (found !== undefined) {
        return found
      } else {
        const variable = new Var(strs[0])
        map.set(variable.name, variable)
        return variable
      }
    }
  }

  static extractVarMap(value: Value): Map<string, Var> {
    if (value instanceof Var) {
      return new Map([[value.name, value]])
    } else if (value instanceof Array) {
      const map = new Map()
      for (const e of value) {
        for (const [name, v] of this.extractVarMap(e)) {
          map.set(name, v)
        }
      }
      return map
    } else if (isObject(value)) {
      const map = new Map()
      for (const k in value) {
        for (const [name, v] of this.extractVarMap(value[k])) {
          map.set(name, v)
        }
      }
      return map
    } else {
      return new Map()
    }
  }
}

export function v(strs: TemplateStringsArray): Var {
  const [name] = strs
  return new Var(name)
}
