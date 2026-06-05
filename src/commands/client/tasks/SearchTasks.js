import { Task } from '../../../models/Task.js'

export class SearchTasks {
  constructor({ q }) {
    this.q = q
  }

  async execute() {
    const tasks = await Task.find({
      name: { $regex: this.q, $options: 'i' },
      status: 'active',
    }).limit(20)
    return { tasks }
  }
}
