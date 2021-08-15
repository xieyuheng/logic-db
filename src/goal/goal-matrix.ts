import { GoalQueue } from "../goal"

export class GoalMatrix {
  queues: Array<GoalQueue>

  constructor(queues: Array<GoalQueue>) {
    this.queues = queues
  }
}
