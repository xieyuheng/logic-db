import { Clause } from "../clause"
import { Logical, VariableFinder } from "../api"
import { Goal } from "../goal"
import { Ctx } from "../ctx"

export class Rule<T> extends Clause<T> {
  data: Logical<T>
  premises: (v: VariableFinder, ctx: Ctx) => Array<Goal>

  constructor(opts: {
    data: Logical<T>
    premises: (v: VariableFinder, ctx: Ctx) => Array<Goal>
  }) {
    super()
    this.data = opts.data
    this.premises = opts.premises
  }

  static create<T>(opts: {
    data: Logical<T>
    premises: (v: VariableFinder, ctx: Ctx) => Array<Goal>
  }): Rule<T> {
    return new Rule(opts)
  }
}
