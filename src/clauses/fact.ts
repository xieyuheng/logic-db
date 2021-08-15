import { Clause } from "../clause"
import { Logical } from "../api"

export class Fact<T> extends Clause<T> {
  conclusion: Logical<T>

  constructor(opts: { conclusion: Logical<T> }) {
    super()
    this.conclusion = opts.conclusion
  }

  static create<T>(opts: { conclusion: Logical<T> }): Fact<T> {
    return new Fact(opts)
  }
}
