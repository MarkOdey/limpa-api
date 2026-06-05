import Boom from '@hapi/boom'

export class NotifyAvailable {
  constructor({ uid, sessionId }) {
    this.uid = uid
    this.sessionId = sessionId
  }

  async execute() {
    // TODO: notify client of cleaner availability for next recurring session
    throw Boom.notImplemented()
  }
}
