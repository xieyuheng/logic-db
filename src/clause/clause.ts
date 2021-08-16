import { Logical } from "../value"

export abstract class Clause<T> {
  abstract data: Logical<T>
}
