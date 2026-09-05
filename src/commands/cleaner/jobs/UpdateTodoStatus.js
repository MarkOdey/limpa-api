import Boom from '@hapi/boom'
import { Job } from '../../../models/Job.js'
import { getCleaner } from '../../_helpers/getCleaner.js'

export class UpdateTodoStatus {
  constructor({ uid, jobId, todoId, status }) {
    this.uid = uid
    this.jobId = jobId
    this.todoId = todoId
    this.status = status
  }

  async execute() {
    const cleaner = await getCleaner(this.uid)
    const job = await Job.findOneAndUpdate(
      { _id: this.jobId, cleanerId: cleaner._id, 'todoList._id': this.todoId },
      {
        $set: {
          'todoList.$.status': this.status,
          ...(this.status === 'done' ? { 'todoList.$.completedAt': new Date() } : {}),
        },
      },
      { new: true }
    )
    if (!job) throw Boom.notFound('Job or todo not found')
    const todo = job.todoList.id(this.todoId)
    return { todoId: todo._id, status: todo.status, completedAt: todo.completedAt }
  }
}
