import {
  Var,
  Value,
  Logical,
  extractVars,
  freshenValue,
  VariableFinder,
  createVariableFinder,
} from "../value"
import { Solver, SolverOptions } from "../solver"
import { Ctx } from "../ctx"
import { Clause } from "../clause"
import { Goal } from "../goal"
import * as Goals from "../goals"
import * as Clauses from "../clauses"
import * as ut from "../ut"
import ty, { Schema, Errors } from "@xieyuheng/ty"

// NOTE Our table is like prolog's predicate.
// - We define predicate by writing down Horn clauses.
// - A predicate describe relation between its arguments.
// - Predicate can be defined by function and vice versa,
//   however predicate is good at expressing relations,
//   because it make no distinction between input and output.
// - A clause is either a rule or a fact.
//   The clauses that constitute a predicate denote logical alternatives:
//   If any clause is true, then the whole predicate is true.

export class Table<T> {
  clauses: Array<Clause<T>> = []
  name: string
  schema: Schema<T>

  constructor(opts: { name: string; schema: Schema<T> }) {
    this.name = opts.name
    this.schema = opts.schema
  }

  i(
    data: Logical<T>,
    premises?: (v: VariableFinder, ctx: Ctx) => Array<Goal>
  ): void {
    if (premises) {
      this.clauses.push(Clauses.Rule.create({ data, premises }))
    } else {
      this.clauses.push(Clauses.Fact.create({ data }))
    }
  }

  o(data: Logical<T>): Goal {
    return new Goals.Relation({ table: this, data })
  }

  query(data: Logical<T>, opts: QueryOptions = {}): Array<Logical<T>> {
    data = freshenValue(data) as Logical<T>

    const solver = Solver.forGoals([this.o(data)], opts)
    const solutions = solver.solve()
    const results = solutions.map((subst) => subst.reify(data) as Logical<T>)

    if (opts.log) {
      console.log(results)
    }

    return results
  }

  find<R>(
    data: Logical<T>,
    varSchemas: { [P in keyof R]: Schema<R[P]> },
    opts: QueryOptions = {}
  ): Array<R> {
    data = freshenValue(data) as Logical<T>

    const solver = Solver.forGoals([this.o(data)], opts)
    const solutions = solver.solve()

    const results = []
    const v = createVariableFinder(extractVars(data))
    const varEntries = Object.keys(varSchemas).map((name) => [
      name,
      v([name] as unknown as TemplateStringsArray),
    ])
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

  get(data: Logical<T>): Logical<T> | undefined {
    const [result] = this.query(data, { limit: 1 })
    return result
  }

  assert(data: Logical<T>): void {
    const result = this.get(data)
    if (result === undefined) {
      throw new Error(
        [
          `An assertion is made that the data is in the table,`,
          `but it is actually not in the table.`,
          `  table: ${this.name}`,
          `  data: ${JSON.stringify(data)}`,
        ].join("\n")
      )
    }
  }

  assertNot(data: Logical<T>): void {
    const result = this.get(data)
    if (result !== undefined) {
      throw new Error(
        [
          `An assertion is made that the data is **not** in the table,`,
          `but it is actually in the table.`,
          `  table: ${this.name}`,
          `  data: ${JSON.stringify(data)}`,
        ].join("\n")
      )
    }
  }

  assertResults(data: Logical<T>, results: Array<Logical<T>>): void {
    const found = this.query(data)
    if (!ut.equal(found, results)) {
      throw new Error(
        [
          `An assertion is made on the query results,`,
          `but the found results is not equal to the asserted results.`,
          `  table: ${this.name}`,
          `  data: ${JSON.stringify(data)}`,
          `  found    results: ${JSON.stringify(found)}`,
          `  asserted results: ${JSON.stringify(results)}`,
        ].join("\n")
      )
    }
  }
}

type QueryOptions = SolverOptions & {
  log?: boolean
}
