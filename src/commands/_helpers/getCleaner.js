import Boom from '@hapi/boom'
import { Cleaner } from '../../models/Cleaner.js'

export async function getCleaner(uid) {
  const cleaner = await Cleaner.findOne({ firebaseUid: uid })
  if (!cleaner) throw Boom.notFound('Cleaner not found')
  return cleaner
}
