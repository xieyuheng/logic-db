import { Logical } from "../api"

export abstract class Clause<T> {
  abstract data: Logical<T>
}
