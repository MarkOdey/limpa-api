import { ServiceRequest } from '../../../models/ServiceRequest.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class GetServiceRequests {
  constructor({ uid, locationId }) {
    this.uid = uid
    this.locationId = locationId
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const filter = { clientId }
    if (this.locationId) filter.locationId = this.locationId
    return ServiceRequest.find(filter).sort({ createdAt: -1 })
  }
}
