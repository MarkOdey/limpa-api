import Boom from '@hapi/boom'
import { Job } from '../../../models/Job.js'
import { getCleaner } from '../../_helpers/getCleaner.js'

export class StartJob {
  constructor({ uid, jobId }) {
    this.uid = uid
    this.jobId = jobId
  }

  async execute() {
    const cleaner = await getCleaner(this.uid)
    const job = await Job.findOneAndUpdate(
      { _id: this.jobId, cleanerId: cleaner._id, status: 'scheduled' },
      { $set: { status: 'in_progress', startedAt: new Date() } },
      { new: true }
    )
    if (!job) throw Boom.notFound('Job not found or not schedulable')
    return job
  }
}
