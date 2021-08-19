import { Var, VarFinder } from "../value"
import { Solver } from "../solver"
import { Goal } from "../goal"
import ty, { Schema, Errors } from "@xieyuheng/ty"
import * as ut from "../ut"

export function find<T>(
  goals: (v: VarFinder) => Array<Goal>,
  varSchemas: { [P in keyof T]: Schema<T[P]> },
  opts: { limit?: number } = {}
): Array<T> {
  const vars = Object.keys(varSchemas).map((name) => new Var(name))
  const varEntries: Array<[string, Var]> = vars.map((v) => [v.name, v])
  const v = Var.createVarFinder(new Map(varEntries))
  const searching = Solver.forGoals(goals(v))
  const solutions = searching.solve({ limit: opts.limit })
  const results = []
  for (const subst of solutions) {
    const result = subst.reify(Object.fromEntries(varEntries))
    try {
      results.push(ty.object(varSchemas).validate(result))
    } catch (error) {
      if (error instanceof Errors.InvalidData && error.data instanceof Var) {
        // NOTE Ok
      } else {
        throw error
      }
    }
  }

  return results
}

export function assertFindResults<T>(
  goals: (v: VarFinder) => Array<Goal>,
  varSchemas: { [P in keyof T]: Schema<T[P]> },
  results: Array<T>,
  opts: { limit?: number } = {}
): void {
  const found = find(goals, varSchemas, { limit: opts.limit })
  if (!ut.equal(found, results)) {
    throw new Error(
      [
        "I expect found to be equal to the given results,",
        "but they are not the equal.",
        `  found results: ${JSON.stringify(found)}`,
        `  given results: ${JSON.stringify(results)}`,
      ].join("\n")
    )
  }
}
