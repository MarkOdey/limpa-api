import Boom from '@hapi/boom'
import { Client } from '../../../models/Client.js'

export class UpdateClientProfile {
  constructor({ uid, data }) {
    this.uid = uid
    this.data = data
  }

  async execute() {
    const client = await Client.findOneAndUpdate(
      { firebaseUid: this.uid },
      { $set: this.data },
      { new: true }
    ).select('-fcmTokens')
    if (!client) throw Boom.notFound('Client not found')
    return client
  }
}
