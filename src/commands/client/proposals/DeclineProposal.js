import Boom from '@hapi/boom'

export class DeclineProposal {
  constructor({ uid, requestId, proposalId }) {
    this.uid = uid
    this.requestId = requestId
    this.proposalId = proposalId
  }

  async execute() {
    // TODO: set proposal status to declined, notify cleaner
    throw Boom.notImplemented()
  }
}
