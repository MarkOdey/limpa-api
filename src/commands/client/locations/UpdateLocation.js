import Boom from '@hapi/boom'
import { Location } from '../../../models/Location.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class UpdateLocation {
  constructor({ uid, locationId, data }) {
    this.uid = uid
    this.locationId = locationId
    this.data = data
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const location = await Location.findOneAndUpdate(
      { _id: this.locationId, clientId },
      { $set: this.data },
      { new: true }
    )
    if (!location) throw Boom.notFound('Location not found')
    return location
  }
}
