import { Location } from '../../../models/Location.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class GetLocations {
  constructor({ uid }) {
    this.uid = uid
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    return Location.find({ clientId })
  }
}
