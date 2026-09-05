import Boom from '@hapi/boom'

export class NotifyAvailable {
  constructor({ uid, jobId }) {
    this.uid = uid
    this.jobId = jobId
  }

  async execute() {
    // TODO: notify client of cleaner availability for next recurring job
    throw Boom.notImplemented()
  }
}
