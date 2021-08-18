import { Var, Value, VariableFinder, createVariableFinder } from "../value"
import { Solver, SolverOptions } from "../solver"
import { Goal } from "../goal"

type QueryOptions = SolverOptions & {
  log?: boolean
}

export function query(
  vars: Array<Var>,
  goals: (v: VariableFinder) => Array<Goal>,
  opts: QueryOptions = {}
): Array<Record<string, Value>> {
  const varEntries: Array<[string, Var]> = vars.map((v) => [v.name, v])
  const v = createVariableFinder(new Map(varEntries))
  const searching = Solver.forGoals(goals(v), opts)
  const solutions = searching.solve()
  const results = solutions.map(
    (subst) =>
      subst.reify(Object.fromEntries(varEntries)) as Record<string, Value>
  )
  if (opts.log) {
    console.log(results)
  }
  return results
}
