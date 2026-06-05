import Boom from '@hapi/boom'
import { ServiceRequest } from '../../../models/ServiceRequest.js'

export class GetCleanerRequest {
  constructor({ requestId }) {
    this.requestId = requestId
  }

  async execute() {
    const req = await ServiceRequest.findOne({ _id: this.requestId, status: 'open' })
      .populate('locationId', 'address')
    if (!req) throw Boom.notFound('Request not found')
    return req
  }
}
