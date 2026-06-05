import Boom from '@hapi/boom'
import { Cleaner } from '../../../models/Cleaner.js'

export class UpdateCleanerProfile {
  constructor({ uid, data }) {
    this.uid = uid
    this.data = data
  }

  async execute() {
    const cleaner = await Cleaner.findOneAndUpdate(
      { firebaseUid: this.uid },
      { $set: this.data },
      { new: true }
    ).select('-fcmTokens')
    if (!cleaner) throw Boom.notFound('Cleaner not found')
    return cleaner
  }
}
