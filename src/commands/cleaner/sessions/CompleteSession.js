import Boom from '@hapi/boom'
import { Session } from '../../../models/Session.js'
import { getCleaner } from '../../_helpers/getCleaner.js'
import { calcBilling } from '../../../services/stripe.js'

export class CompleteSession {
  constructor({ uid, sessionId }) {
    this.uid = uid
    this.sessionId = sessionId
  }

  async execute() {
    const cleaner = await getCleaner(this.uid)
    const session = await Session.findOne({ _id: this.sessionId, cleanerId: cleaner._id, status: 'in_progress' })
    if (!session) throw Boom.notFound('Session not found or not in progress')

    const doneTodos = session.todoList.filter((t) => t.status === 'done')
    // TODO: fetch per-task prices from proposal/task modifiers for accurate billing
    const { billedAmount, platformFee } = calcBilling(doneTodos.map(() => ({ price: 0 })))

    const updated = await Session.findByIdAndUpdate(
      session._id,
      { $set: { status: 'completed', completedAt: new Date(), billedAmount, platformFee } },
      { new: true }
    )

    return { _id: updated._id, status: updated.status, billedAmount, platformFee, completedAt: updated.completedAt }
  }
}
