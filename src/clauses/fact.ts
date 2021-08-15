import { Clause } from "../clause"
import { Logical } from "../api"

export class Fact<T> extends Clause<T> {
  data: Logical<T>

  constructor(opts: { data: Logical<T> }) {
    super()
    this.data = opts.data
  }

  static create<T>(opts: { data: Logical<T> }): Fact<T> {
    return new Fact(opts)
  }
}
