import { GoalQueue } from "../goal"

export class GoalMatix {
  queues: Array<GoalQueue>

  constructor(queues: Array<GoalQueue>) {
    this.queues = queues
  }
}
