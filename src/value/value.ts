export class Var {
  id: number
  name?: string

  static counter = 0

  constructor(name?: string) {
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
