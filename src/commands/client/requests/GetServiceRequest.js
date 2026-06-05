import Boom from '@hapi/boom'
import { ServiceRequest } from '../../../models/ServiceRequest.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class GetServiceRequest {
  constructor({ uid, requestId }) {
    this.uid = uid
    this.requestId = requestId
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const req = await ServiceRequest.findOne({ _id: this.requestId, clientId })
    if (!req) throw Boom.notFound('Request not found')
    return req
  }
}
