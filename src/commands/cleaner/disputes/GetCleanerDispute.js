import Boom from '@hapi/boom'
import { Dispute } from '../../../models/Dispute.js'
import { getCleaner } from '../../_helpers/getCleaner.js'

export class GetCleanerDispute {
  constructor({ uid, disputeId }) {
    this.uid = uid
    this.disputeId = disputeId
  }

  async execute() {
    const cleaner = await getCleaner(this.uid)
    const dispute = await Dispute.findOne({ _id: this.disputeId, cleanerId: cleaner._id })
    if (!dispute) throw Boom.notFound('Dispute not found')
    return dispute
  }
}
