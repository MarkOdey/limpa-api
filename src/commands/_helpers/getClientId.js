import Boom from '@hapi/boom'
import { Client } from '../../models/Client.js'

export async function getClientId(uid) {
  const client = await Client.findOne({ firebaseUid: uid }).select('_id')
  if (!client) throw Boom.notFound('Client not found')
  return client._id
}
