import { Goal } from "../goal"
import { Table } from "../table"
import { Logical } from "../api"
import { Subst } from "../subst"

export class UnitGoal<T> extends Goal {
  table: Table<T>
  data: Logical<T>

  constructor(opts: { table: Table<T>; data: Logical<T> }) {
    super()
    this.table = opts.table
    this.data = opts.data
  }

  static create<T>(opts: { table: Table<T>; data: Logical<T> }): UnitGoal<T> {
    return new UnitGoal(opts)
  }

  evaluate(subst: Subst): void {}
}
