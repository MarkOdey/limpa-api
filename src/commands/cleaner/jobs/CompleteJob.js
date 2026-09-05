import Boom from '@hapi/boom'
import { Job } from '../../../models/Job.js'
import { getCleaner } from '../../_helpers/getCleaner.js'
import { calcBilling } from '../../../services/stripe.js'

export class CompleteJob {
  constructor({ uid, jobId }) {
    this.uid = uid
    this.jobId = jobId
  }

  async execute() {
    const cleaner = await getCleaner(this.uid)
    const job = await Job.findOne({ _id: this.jobId, cleanerId: cleaner._id, status: 'in_progress' })
    if (!job) throw Boom.notFound('Job not found or not in progress')

    const doneTodos = job.todoList.filter((t) => t.status === 'done')
    // TODO: fetch per-task prices from proposal/task modifiers for accurate billing
    const { billedAmount, platformFee } = calcBilling(doneTodos.map(() => ({ price: 0 })))

    const updated = await Job.findByIdAndUpdate(
      job._id,
      { $set: { status: 'completed', completedAt: new Date(), billedAmount, platformFee } },
      { new: true }
    )

    return { _id: updated._id, status: updated.status, billedAmount, platformFee, completedAt: updated.completedAt }
  }
}
