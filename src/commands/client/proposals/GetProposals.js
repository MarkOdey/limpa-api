import { Proposal } from '../../../models/Proposal.js'

export class GetProposals {
  constructor({ requestId }) {
    this.requestId = requestId
  }

  async execute() {
    return Proposal.find({ serviceRequestId: this.requestId })
      .populate('cleanerId', 'firstName avatarUrl yearsOfExperience reputationScore badges')
  }
}
