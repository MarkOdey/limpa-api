import { ConfiguredTask } from '../../../models/ConfiguredTask.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class CreateLocationTask {
  constructor({ uid, locationId, data }) {
    this.uid = uid
    this.locationId = locationId
    this.data = data
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    return ConfiguredTask.create({
      clientId,
      locationId: this.locationId,
      ...this.data,
      status: this.data.taskId ? 'active' : 'pending',
    })
  }
}
