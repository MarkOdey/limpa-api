import Boom from '@hapi/boom'

export class CounterProposal {
  constructor({ uid, requestId, proposalId, counterProposal }) {
    this.uid = uid
    this.requestId = requestId
    this.proposalId = proposalId
    this.counterProposal = counterProposal
  }

  async execute() {
    // TODO: set proposal status to countered, store counter-proposal, notify cleaner
    throw Boom.notImplemented()
  }
}
