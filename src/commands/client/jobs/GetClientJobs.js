import { Job } from '../../../models/Job.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class GetClientJobs {
  constructor({ uid }) {
    this.uid = uid
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    return Job.find({ clientId }).sort({ scheduledDate: -1 })
  }
}
