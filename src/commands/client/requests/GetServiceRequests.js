import { ServiceRequest } from '../../../models/ServiceRequest.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class GetServiceRequests {
  constructor({ uid }) {
    this.uid = uid
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    return ServiceRequest.find({ clientId }).sort({ createdAt: -1 })
  }
}
