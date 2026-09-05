import { Job } from '../../../models/Job.js'
import { getCleaner } from '../../_helpers/getCleaner.js'

export class GetCleanerJobs {
  constructor({ uid }) {
    this.uid = uid
  }

  async execute() {
    const cleaner = await getCleaner(this.uid)
    return Job.find({ cleanerId: cleaner._id }).sort({ scheduledDate: -1 })
  }
}
