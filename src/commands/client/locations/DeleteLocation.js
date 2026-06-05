import Boom from '@hapi/boom'
import { Location } from '../../../models/Location.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class DeleteLocation {
  constructor({ uid, locationId }) {
    this.uid = uid
    this.locationId = locationId
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const result = await Location.deleteOne({ _id: this.locationId, clientId })
    if (!result.deletedCount) throw Boom.notFound('Location not found')
    return { success: true }
  }
}
