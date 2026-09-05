import Boom from '@hapi/boom'
import { Cleaner } from '../../../models/Cleaner.js'

export class GetPublicProfile {
  constructor({ cleanerId }) {
    this.cleanerId = cleanerId
  }

  async execute() {
    const cleaner = await Cleaner.findById(this.cleanerId)
      .populate('badges')
      .select('firstName avatarUrl yearsOfExperience reputationScore completedJobCount badges')
    if (!cleaner) throw Boom.notFound('Cleaner not found')
    return cleaner
  }
}
