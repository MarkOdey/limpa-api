import Boom from '@hapi/boom'

export class AcceptCounterProposal {
  constructor({ uid, proposalId }) {
    this.uid = uid
    this.proposalId = proposalId
  }

  async execute() {
    // TODO: cleaner accepts client counter-proposal, create session
    throw Boom.notImplemented()
  }
}
