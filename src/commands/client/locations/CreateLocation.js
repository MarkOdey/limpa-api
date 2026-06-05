import { Location } from '../../../models/Location.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class CreateLocation {
  constructor({ uid, data }) {
    this.uid = uid
    this.data = data
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    return Location.create({ clientId, ...this.data })
  }
}
