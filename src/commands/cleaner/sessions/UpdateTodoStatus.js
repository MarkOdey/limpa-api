import Boom from '@hapi/boom'
import { Session } from '../../../models/Session.js'
import { getCleaner } from '../../_helpers/getCleaner.js'

export class UpdateTodoStatus {
  constructor({ uid, sessionId, todoId, status }) {
    this.uid = uid
    this.sessionId = sessionId
    this.todoId = todoId
    this.status = status
  }

  async execute() {
    const cleaner = await getCleaner(this.uid)
    const session = await Session.findOneAndUpdate(
      { _id: this.sessionId, cleanerId: cleaner._id, 'todoList._id': this.todoId },
      {
        $set: {
          'todoList.$.status': this.status,
          ...(this.status === 'done' ? { 'todoList.$.completedAt': new Date() } : {}),
        },
      },
      { new: true }
    )
    if (!session) throw Boom.notFound('Session or todo not found')
    const todo = session.todoList.id(this.todoId)
    return { todoId: todo._id, status: todo.status, completedAt: todo.completedAt }
  }
}
