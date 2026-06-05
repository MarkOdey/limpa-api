import Boom from '@hapi/boom'
import { Location } from '../../../models/Location.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class UpdateLand {
  constructor({ uid, locationId, land }) {
    this.uid = uid
    this.locationId = locationId
    this.land = land
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const location = await Location.findOneAndUpdate(
      { _id: this.locationId, clientId },
      { $set: { land: this.land } },
      { new: true }
    )
    if (!location) throw Boom.notFound('Location not found')
    return { _id: location._id, land: location.land, updatedAt: location.updatedAt }
  }
}
