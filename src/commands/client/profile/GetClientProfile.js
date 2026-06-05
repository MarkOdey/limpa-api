import Boom from '@hapi/boom'
import { Client } from '../../../models/Client.js'

export class GetClientProfile {
  constructor({ uid }) {
    this.uid = uid
  }

  async execute() {
    const client = await Client.findOne({ firebaseUid: this.uid }).select('-fcmTokens')
    if (!client) throw Boom.notFound('Client not found')
    return client
  }
}
