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
