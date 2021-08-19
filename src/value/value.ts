import { Var } from "../value"

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
