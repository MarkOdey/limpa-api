import Boom from '@hapi/boom'
import { Cleaner } from '../../../models/Cleaner.js'

export class UpdateAvailability {
  constructor({ uid, availability }) {
    this.uid = uid
    this.availability = availability
  }

  async execute() {
    const cleaner = await Cleaner.findOneAndUpdate(
      { firebaseUid: this.uid },
      { $set: { availability: this.availability } },
      { new: true }
    )
    if (!cleaner) throw Boom.notFound('Cleaner not found')
    return { availability: cleaner.availability, updatedAt: cleaner.updatedAt }
  }
}
