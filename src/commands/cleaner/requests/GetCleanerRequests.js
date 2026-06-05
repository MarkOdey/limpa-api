import { ServiceRequest } from '../../../models/ServiceRequest.js'
import { getCleaner } from '../../_helpers/getCleaner.js'

export class GetCleanerRequests {
  constructor({ uid }) {
    this.uid = uid
  }

  async execute() {
    const cleaner = await getCleaner(this.uid)
    return ServiceRequest.find({
      status: 'open',
      ...(cleaner.serviceArea?.coordinates?.length
        ? { /* TODO: geo filter by cleaner service area radius */ }
        : {}),
    }).sort({ broadcastedAt: -1 })
  }
}
