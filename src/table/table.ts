import { Logical } from "../api"
import { Ctx } from "../ctx"
import { Clause } from "../clause"
import { Goal } from "../goal"
import * as Goals from "../goals"
import * as Clauses from "../clauses"
import ty from "@xieyuheng/ty"
import { Schema } from "@xieyuheng/ty"

export class Table<T> {
  private clauses: Array<Clause<T>> = []

  name: string
  schema: Schema<T>

  constructor(opts: { name: string; schema: Schema<T> }) {
    this.name = opts.name
    this.schema = opts.schema
  }

  static create<T>(opts: { name: string; schema: Schema<T> }): Table<T> {
    const { name, schema } = opts
    return new Table({ name, schema })
  }

  i(data: Logical<T>, premises?: (v: Ctx) => Array<Goal>): void {
    if (premises) {
      this.clauses.push(Clauses.Rule.create({ conclusion: data, premises }))
    } else {
      this.clauses.push(Clauses.Fact.create({ conclusion: data }))
    }
  }

  o(data: Logical<T>): Goal {
    return Goals.UnitGoal.create({ table: this, data })
  }

  query(pattern: Logical<T>, opts?: { limit?: number }) {
    // let var_map = new Map
    // let data = pattern_to_data_with_var_map (pattern, var_map)
    // let searching = new searching_t ([
    //   new prop_row_t (new subst_t, [this.o (data)])
    // ])
    // let solutions = searching
    //   .take_subst(opts?.limit)
    //   .map ((subst) => {
    //     let sol = {}
    //     for (let name of var_map.keys ()) {
    //       sol [name] = subst.reify (
    //         var_map.get (name))
    //     }
    //     return sol
    //   })
    // let query_res = new query_res_t
    // query_res.solutions = solutions
    // return query_res
  }
}
