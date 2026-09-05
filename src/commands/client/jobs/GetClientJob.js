import Boom from '@hapi/boom'
import { Job } from '../../../models/Job.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class GetClientJob {
  constructor({ uid, jobId }) {
    this.uid = uid
    this.jobId = jobId
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const job = await Job.findOne({ _id: this.jobId, clientId })
      .populate('cleanerId', 'firstName avatarUrl')
    if (!job) throw Boom.notFound('Job not found')
    return job
  }
}
