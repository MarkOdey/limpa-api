import { Session } from '../../../models/Session.js'
import { getCleaner } from '../../_helpers/getCleaner.js'

export class GetCleanerSessions {
  constructor({ uid }) {
    this.uid = uid
  }

  async execute() {
    const cleaner = await getCleaner(this.uid)
    return Session.find({ cleanerId: cleaner._id }).sort({ scheduledDate: -1 })
  }
}
