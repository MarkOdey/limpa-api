import Boom from '@hapi/boom'
import { Session } from '../../../models/Session.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class GetClientSession {
  constructor({ uid, sessionId }) {
    this.uid = uid
    this.sessionId = sessionId
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const session = await Session.findOne({ _id: this.sessionId, clientId })
      .populate('cleanerId', 'firstName avatarUrl')
    if (!session) throw Boom.notFound('Session not found')
    return session
  }
}
