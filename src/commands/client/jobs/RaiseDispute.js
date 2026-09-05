import Boom from '@hapi/boom'
import { Job } from '../../../models/Job.js'
import { Dispute } from '../../../models/Dispute.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class RaiseDispute {
  constructor({ uid, jobId, disputedTodos }) {
    this.uid = uid
    this.jobId = jobId
    this.disputedTodos = disputedTodos
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const job = await Job.findOne({ _id: this.jobId, clientId, status: 'completed' })
    if (!job) throw Boom.notFound('Job not found or not completed')

    const hoursSinceCompletion = (Date.now() - job.completedAt) / 36e5
    if (hoursSinceCompletion > 24) throw Boom.forbidden('Dispute window has closed (24h)')

    const dispute = await Dispute.create({
      jobId: job._id,
      clientId,
      cleanerId: job.cleanerId,
      disputedTodos: this.disputedTodos,
    })

    await Job.updateOne({ _id: job._id }, { $set: { status: 'disputed' } })
    return dispute
  }
}
