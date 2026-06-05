import Boom from '@hapi/boom'
import { Session } from '../../../models/Session.js'
import { Dispute } from '../../../models/Dispute.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class RaiseDispute {
  constructor({ uid, sessionId, disputedTodos }) {
    this.uid = uid
    this.sessionId = sessionId
    this.disputedTodos = disputedTodos
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const session = await Session.findOne({ _id: this.sessionId, clientId, status: 'completed' })
    if (!session) throw Boom.notFound('Session not found or not completed')

    const hoursSinceCompletion = (Date.now() - session.completedAt) / 36e5
    if (hoursSinceCompletion > 24) throw Boom.forbidden('Dispute window has closed (24h)')

    const dispute = await Dispute.create({
      sessionId: session._id,
      clientId,
      cleanerId: session.cleanerId,
      disputedTodos: this.disputedTodos,
    })

    await Session.updateOne({ _id: session._id }, { $set: { status: 'disputed' } })
    return dispute
  }
}
