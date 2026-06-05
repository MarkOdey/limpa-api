import Boom from '@hapi/boom'
import { Location } from '../../../models/Location.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class GetLocation {
  constructor({ uid, locationId }) {
    this.uid = uid
    this.locationId = locationId
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const location = await Location.findOne({ _id: this.locationId, clientId })
    if (!location) throw Boom.notFound('Location not found')
    return location
  }
}
