import Boom from '@hapi/boom'
import { Job } from '../../../models/Job.js'
import { getCleaner } from '../../_helpers/getCleaner.js'

export class GetCleanerJob {
  constructor({ uid, jobId }) {
    this.uid = uid
    this.jobId = jobId
  }

  async execute() {
    const cleaner = await getCleaner(this.uid)
    const job = await Job.findOne({ _id: this.jobId, cleanerId: cleaner._id })
    if (!job) throw Boom.notFound('Job not found')
    return job
  }
}
