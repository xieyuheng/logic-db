import { Var, Value, VarFinder } from "../value"
import { Solver } from "../solver"
import { Goal } from "../goal"

export function query(
  goals: (v: VarFinder) => Array<Goal>,
  varNames: Array<string>,
  opts: { limit?: number } = {}
): Array<Record<string, Value>> {
  varNames = Array.from(new Set(varNames)) // NOTE dedup
  const vars = varNames.map((name) => new Var(name))
  const varEntries: Array<[string, Var]> = vars.map((v) => [v.name, v])
  const v = Var.createVarFinder(new Map(varEntries))
  const searching = Solver.forGoals(goals(v))
  const solutions = searching.solve({ limit: opts.limit })
  const results = solutions.map(
    (subst) =>
      subst.reify(Object.fromEntries(varEntries)) as Record<string, Value>
  )

  return results
}
