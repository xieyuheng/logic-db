import { Var, Value, VariableFinder, createVariableFinder } from "../value"
import { Solver, SolverOptions } from "../solver"
import { Goal } from "../goal"
import ty, { Schema, Errors } from "@xieyuheng/ty"

type QueryOptions = SolverOptions & {
  log?: boolean
}

export function find<T>(
  goals: (v: VariableFinder) => Array<Goal>,
  varSchemas: { [P in keyof T]: Schema<T[P]> },
  opts: QueryOptions = {}
): Array<T> {
  const vars = Object.keys(varSchemas).map((name) => new Var(name))
  const varEntries: Array<[string, Var]> = vars.map((v) => [v.name, v])
  const v = createVariableFinder(new Map(varEntries))
  const searching = Solver.forGoals(goals(v), opts)
  const solutions = searching.solve()
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

  if (opts.log) {
    console.log(results)
  }

  return results
}
