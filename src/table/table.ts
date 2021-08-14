import { Logical } from "../api"
import ty from "@xieyuheng/ty"
import { Schema } from "@xieyuheng/ty"

export class Table<T> {
  private rows: Array<Logical<T>> = []

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

  i(data: Logical<T>): void {
    this.rows.push(data)
  }

  o(data: Logical<T>): Proposition {
    return new Proposition()
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

class Proposition {}
