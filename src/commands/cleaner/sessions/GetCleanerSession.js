import Boom from '@hapi/boom'
import { Session } from '../../../models/Session.js'
import { getCleaner } from '../../_helpers/getCleaner.js'

export class GetCleanerSession {
  constructor({ uid, sessionId }) {
    this.uid = uid
    this.sessionId = sessionId
  }

  async execute() {
    const cleaner = await getCleaner(this.uid)
    const session = await Session.findOne({ _id: this.sessionId, cleanerId: cleaner._id })
    if (!session) throw Boom.notFound('Session not found')
    return session
  }
}
