import Boom from '@hapi/boom'
import { Proposal } from '../../../models/Proposal.js'

export class GetProposal {
  constructor({ requestId, proposalId }) {
    this.requestId = requestId
    this.proposalId = proposalId
  }

  async execute() {
    const proposal = await Proposal.findOne({
      _id: this.proposalId,
      serviceRequestId: this.requestId,
    }).populate('cleanerId')
    if (!proposal) throw Boom.notFound('Proposal not found')
    return proposal
  }
}
