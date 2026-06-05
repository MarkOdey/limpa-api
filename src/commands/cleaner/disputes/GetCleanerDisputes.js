import { Dispute } from '../../../models/Dispute.js'
import { getCleaner } from '../../_helpers/getCleaner.js'

export class GetCleanerDisputes {
  constructor({ uid }) {
    this.uid = uid
  }

  async execute() {
    const cleaner = await getCleaner(this.uid)
    return Dispute.find({ cleanerId: cleaner._id }).sort({ createdAt: -1 })
  }
}
