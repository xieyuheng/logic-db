import { Var, Logical, freshenValue, VarFinder } from "../value"
import { Solver } from "../solver"
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
    premises?: (v: VarFinder, ctx: Ctx) => Array<Goal>
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

  query(data: Logical<T>, opts: { limit?: number } = {}): Array<Logical<T>> {
    data = freshenValue(data) as Logical<T>

    const solver = Solver.forGoals([this.o(data)])
    const solutions = solver.solve({ limit: opts.limit })

    return solutions.map((subst) => subst.reify(data) as Logical<T>)
  }

  find<R>(
    data: Logical<T>,
    varSchemas: { [P in keyof R]: Schema<R[P]> },
    opts: { limit?: number } = {}
  ): Array<R> {
    data = freshenValue(data) as Logical<T>

    const v = Var.finderFromVarMap(Var.extractVarMap(data))
    const varNames = Object.keys(varSchemas)
    const varEntries = varNames.map((name) => [
      name,
      v([name] as unknown as TemplateStringsArray),
    ])

    const solver = Solver.forGoals([this.o(data)])
    const solutions = solver.solve({ limit: opts.limit })

    return solutions
      .map((subst) => subst.reify(Object.fromEntries(varEntries)))
      .filter((result) =>
        ty.object(varSchemas).isValid(result)
      ) as unknown as Array<R>
  }

  get(data: Logical<T>): Logical<T> | undefined {
    const [result] = this.query(data, { limit: 1 })
    return result
  }

  assertSuccess(data: Logical<T>): void {
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

  assertFailure(data: Logical<T>): void {
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

  assertFindResults<R>(opts: {
    data: Logical<T>
    projections: { [P in keyof R]: Schema<R[P]> }
    results: Array<R>
    limit?: number
  }): void {
    const { data, projections, results, limit } = opts

    const found = this.find(data, projections, { limit })
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
