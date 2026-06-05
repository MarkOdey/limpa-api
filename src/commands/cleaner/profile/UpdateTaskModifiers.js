import Boom from '@hapi/boom'
import { Cleaner } from '../../../models/Cleaner.js'

export class UpdateTaskModifiers {
  constructor({ uid, taskModifiers }) {
    this.uid = uid
    this.taskModifiers = taskModifiers
  }

  async execute() {
    const cleaner = await Cleaner.findOneAndUpdate(
      { firebaseUid: this.uid },
      { $set: { taskModifiers: this.taskModifiers } },
      { new: true }
    )
    if (!cleaner) throw Boom.notFound('Cleaner not found')
    return { taskModifiers: cleaner.taskModifiers, updatedAt: cleaner.updatedAt }
  }
}
