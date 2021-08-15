export class Var {
  id: number
  name: string

  static counter = 0

  constructor(name: string) {
    this.id = Var.counter++
    this.name = name
  }
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

export function extractVars(value: Value): { [key: string]: Var } {
  if (value instanceof Var) {
    return { [value.name]: value }
  } else if (value instanceof Array) {
    let vars = {}
    for (const e of value) {
      vars = { ...vars, ...extractVars(e) }
    }
    return vars
  } else if (isObject(value)) {
    let vars = {}
    for (const k in value) {
      vars = { ...vars, ...extractVars(value[k]) }
    }
    return vars
  } else {
    return {}
  }
}

export function freshenValue(
  value: Value,
  vars: Map<number, Var> = new Map()
): Value {
  if (value instanceof Var) {
    const found = vars.get(value.id)
    if (found) {
      return found
    } else {
      const v = new Var(value.name)
      vars.set(v.id, v)
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
