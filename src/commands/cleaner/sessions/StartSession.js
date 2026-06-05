import Boom from '@hapi/boom'
import { Session } from '../../../models/Session.js'
import { getCleaner } from '../../_helpers/getCleaner.js'

export class StartSession {
  constructor({ uid, sessionId }) {
    this.uid = uid
    this.sessionId = sessionId
  }

  async execute() {
    const cleaner = await getCleaner(this.uid)
    const session = await Session.findOneAndUpdate(
      { _id: this.sessionId, cleanerId: cleaner._id, status: 'scheduled' },
      { $set: { status: 'in_progress', startedAt: new Date() } },
      { new: true }
    )
    if (!session) throw Boom.notFound('Session not found or not schedulable')
    return session
  }
}
