import { Var, VarFinder } from "../value"
import { Solver } from "../solver"
import { Goal } from "../goal"
import ty, { Schema } from "@xieyuheng/ty"
import * as ut from "../ut"

export function find<T>(
  goals: (v: VarFinder) => Array<Goal>,
  varSchemas: { [P in keyof T]: Schema<T[P]> },
  opts: { limit?: number } = {}
): Array<T> {
  const varNames = Object.keys(varSchemas)
  const vars = varNames.map((name) => new Var(name))
  const varEntries: Array<[string, Var]> = vars.map((v) => [v.name, v])
  const v = Var.finderFromVarMap(new Map(varEntries))

  const searching = Solver.forGoals(goals(v))
  const solutions = searching.solve({ limit: opts.limit })

  return solutions
    .map((subst) => subst.reify(Object.fromEntries(varEntries)))
    .filter((result) =>
      ty.object(varSchemas).isValid(result)
    ) as unknown as Array<T>
}

export function assertFindResults<T>(opts: {
  goals: (v: VarFinder) => Array<Goal>
  projections: { [P in keyof T]: Schema<T[P]> }
  results: Array<T>
  limit?: number
}): void {
  const { goals, projections, results, limit } = opts

  const found = find(goals, projections, { limit })
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
