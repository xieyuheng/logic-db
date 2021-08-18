export class Var {
  id: number
  name: string

  static guard(data: any): data is Var {
    return data instanceof Var
  }

  static counter = 0

  constructor(name: string) {
    this.id = Var.counter++
    this.name = name
  }
}

export function v(strs: TemplateStringsArray): Var {
  const [name] = strs
  return new Var(name)
}

export type Value =
  | Var
  | null
  | undefined
  | boolean
  | string
  | number
  | Array<Value>
  | { [key: string]: Value }

export function isObject(x: Value): x is { [key: string]: Value } {
  return typeof x === "object" && x !== null && !(x instanceof Array)
}

export function extractVars(value: Value): Map<string, Var> {
  if (value instanceof Var) {
    return new Map([[value.name, value]])
  } else if (value instanceof Array) {
    const vars = new Map()
    for (const e of value) {
      for (const [name, v] of extractVars(e)) {
        vars.set(name, v)
      }
    }
    return vars
  } else if (isObject(value)) {
    const vars = new Map()
    for (const k in value) {
      for (const [name, v] of extractVars(value[k])) {
        vars.set(name, v)
      }
    }
    return vars
  } else {
    return new Map()
  }
}

// NOTE side-effect on vars
export function freshenValue(
  value: Value,
  vars: Map<string, Var> = new Map()
): Value {
  if (value instanceof Var) {
    // NOTE We should use name as the key,
    //   because in the same scope,
    //   variables of the same name are the same variable.
    const found = vars.get(value.name)
    if (found !== undefined) {
      return found
    } else {
      const v = new Var(value.name)
      vars.set(v.name, v)
      return v
    }
  } else if (value instanceof Array) {
    return value.map((e) => freshenValue(e, vars))
  } else if (isObject(value)) {
    let obj: Value = {}
    for (const k in value) {
      obj[k] = freshenValue(value[k], vars)
    }
    return obj
  } else {
    return value
  }
}

export type Logical<T> = Var | { [P in keyof T]: Logical<T[P]> }

export type VariableFinder = (strs: TemplateStringsArray) => Var

// NOTE side-effect on vars
export function createVariableFinder(vars: Map<string, Var>): VariableFinder {
  return (strs) => {
    const found = vars.get(strs[0])
    if (found !== undefined) {
      return found
    } else {
      const variable = new Var(strs[0])
      vars.set(variable.name, variable)
      return variable
    }
  }
}
