import { ConfiguredTask } from '../../../models/ConfiguredTask.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class GetLocationTasks {
  constructor({ uid, locationId }) {
    this.uid = uid
    this.locationId = locationId
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    return ConfiguredTask.find({ clientId, locationId: this.locationId })
  }
}
