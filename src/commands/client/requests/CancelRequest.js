import Boom from '@hapi/boom'
import { ServiceRequest } from '../../../models/ServiceRequest.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class CancelRequest {
  constructor({ uid, requestId }) {
    this.uid = uid
    this.requestId = requestId
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const req = await ServiceRequest.findOneAndUpdate(
      { _id: this.requestId, clientId, status: 'open' },
      { $set: { status: 'cancelled' } },
      { new: true }
    )
    if (!req) throw Boom.notFound('Request not found or not cancellable')
    return req
  }
}
