import Boom from '@hapi/boom'
import { Dispute } from '../../../models/Dispute.js'
import { getCleaner } from '../../_helpers/getCleaner.js'

export class ContestDispute {
  constructor({ uid, disputeId, disputedTodos }) {
    this.uid = uid
    this.disputeId = disputeId
    this.disputedTodos = disputedTodos
  }

  async execute() {
    const cleaner = await getCleaner(this.uid)
    const dispute = await Dispute.findOne({ _id: this.disputeId, cleanerId: cleaner._id, status: 'open' })
    if (!dispute) throw Boom.notFound('Dispute not found or already contested')

    this.disputedTodos.forEach(({ todoId, cleanerResponse }) => {
      const todo = dispute.disputedTodos.find((t) => t.todoId.equals(todoId))
      if (todo) todo.cleanerResponse = cleanerResponse
    })
    dispute.status = 'cleaner_contested'
    await dispute.save()

    return { _id: dispute._id, status: dispute.status, updatedAt: dispute.updatedAt }
  }
}
