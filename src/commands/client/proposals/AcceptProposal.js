import Boom from '@hapi/boom'
import { Proposal } from '../../../models/Proposal.js'
import { ServiceRequest } from '../../../models/ServiceRequest.js'
import { Session } from '../../../models/Session.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class AcceptProposal {
  constructor({ uid, requestId, proposalId }) {
    this.uid = uid
    this.requestId = requestId
    this.proposalId = proposalId
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const proposal = await Proposal.findOne({ _id: this.proposalId, status: 'pending' })
    if (!proposal) throw Boom.notFound('Proposal not found or not pending')

    const serviceReq = await ServiceRequest.findOneAndUpdate(
      { _id: this.requestId, clientId },
      { $set: { status: 'accepted' } },
      { new: true }
    )
    if (!serviceReq) throw Boom.notFound('Service request not found')

    await Proposal.updateOne({ _id: proposal._id }, { $set: { status: 'accepted' } })

    const session = await Session.create({
      serviceRequestId: proposal.serviceRequestId,
      proposalId: proposal._id,
      clientId,
      cleanerId: proposal.cleanerId,
      scheduledDate: proposal.proposedDate,
      hourStart: proposal.proposedHourStart,
      hourEnd: proposal.proposedHourEnd,
      todoList: serviceReq.todoList,
    })

    return { sessionId: session._id, status: 'scheduled', scheduledDate: session.scheduledDate, estimatedPrice: proposal.estimatedPrice }
  }
}
