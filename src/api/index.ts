import { Var } from "../value"

export type Logical<T> = Var | { [P in keyof T]: Logical<T[P]> }

export function p(strs: TemplateStringsArray): Var {
  const [name] = strs
  return new Var(name)
}
