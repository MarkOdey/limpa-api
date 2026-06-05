import Boom from '@hapi/boom'
import { ServiceRequest } from '../../../models/ServiceRequest.js'
import { Proposal } from '../../../models/Proposal.js'
import { getCleaner } from '../../_helpers/getCleaner.js'

export class SubmitProposal {
  constructor({ uid, requestId, data }) {
    this.uid = uid
    this.requestId = requestId
    this.data = data
  }

  async execute() {
    const cleaner = await getCleaner(this.uid)
    const serviceReq = await ServiceRequest.findOne({ _id: this.requestId, status: 'open' })
    if (!serviceReq) throw Boom.notFound('Request not found or not open')

    const proposal = await Proposal.create({
      serviceRequestId: serviceReq._id,
      cleanerId: cleaner._id,
      ...this.data,
    })

    return { _id: proposal._id, status: proposal.status, estimatedPrice: proposal.estimatedPrice, createdAt: proposal.createdAt }
  }
}
