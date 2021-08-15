import { Clause } from "../clause"
import { Logical } from "../api"
// import { Goal } from "../goal"
import { Ctx } from "../ctx"

export class Rule<T> extends Clause<T> {
  conclusion: Logical<T>
  premises: (v: Ctx) => Array<Logical<T>>

  constructor(opts: {
    conclusion: Logical<T>
    premises: (v: Ctx) => Array<Logical<T>>
  }) {
    super()
    this.conclusion = opts.conclusion
    this.premises = opts.premises
  }

  static create<T>(opts: {
    conclusion: Logical<T>
    premises: (v: Ctx) => Array<Logical<T>>
  }): Rule<T> {
    return new Rule(opts)
  }
}
