import Boom from '@hapi/boom'
import { Location } from '../../../models/Location.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class UpdateBuilding {
  constructor({ uid, locationId, building }) {
    this.uid = uid
    this.locationId = locationId
    this.building = building
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const location = await Location.findOneAndUpdate(
      { _id: this.locationId, clientId },
      { $set: { building: this.building } },
      { new: true }
    )
    if (!location) throw Boom.notFound('Location not found')
    return { _id: location._id, building: location.building, updatedAt: location.updatedAt }
  }
}
