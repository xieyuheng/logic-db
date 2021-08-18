import { Var, Value, VariableFinder, createVariableFinder } from "../value"
import { Searching, SearchOptions } from "../searching"
import { Goal } from "../goal"

type QueryOptions = SearchOptions & {
  log?: boolean
}

export function query(
  vars: Array<Var>,
  goals: (v: VariableFinder) => Array<Goal>,
  opts: QueryOptions = {}
): Array<Record<string, Value>> {
  const varEntries: Array<[string, Var]> = vars.map((v) => [v.name, v])
  const v = createVariableFinder(new Map(varEntries))
  const searching = Searching.forGoals(goals(v), opts)
  const solutions = searching.find()
  const results = solutions.map(
    (subst) =>
      subst.reify(Object.fromEntries(varEntries)) as Record<string, Value>
  )
  if (opts.log) {
    console.log(results)
  }
  return results
}
