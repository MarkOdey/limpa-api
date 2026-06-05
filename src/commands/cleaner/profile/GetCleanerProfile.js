import Boom from '@hapi/boom'
import { Cleaner } from '../../../models/Cleaner.js'

export class GetCleanerProfile {
  constructor({ uid }) {
    this.uid = uid
  }

  async execute() {
    const cleaner = await Cleaner.findOne({ firebaseUid: this.uid })
      .populate('badges')
      .select('-fcmTokens')
    if (!cleaner) throw Boom.notFound('Cleaner not found')
    return cleaner
  }
}
