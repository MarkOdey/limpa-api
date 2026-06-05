import Boom from '@hapi/boom'
import { Proposal } from '../../../models/Proposal.js'
import { getCleaner } from '../../_helpers/getCleaner.js'

export class WithdrawProposal {
  constructor({ uid, proposalId }) {
    this.uid = uid
    this.proposalId = proposalId
  }

  async execute() {
    const cleaner = await getCleaner(this.uid)
    const proposal = await Proposal.findOneAndUpdate(
      { _id: this.proposalId, cleanerId: cleaner._id, status: 'pending' },
      { $set: { status: 'withdrawn' } },
      { new: true }
    )
    if (!proposal) throw Boom.notFound('Proposal not found or not withdrawable')
    return proposal
  }
}
