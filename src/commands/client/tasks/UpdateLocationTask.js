import Boom from '@hapi/boom'
import { ConfiguredTask } from '../../../models/ConfiguredTask.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class UpdateLocationTask {
  constructor({ uid, locationId, taskId, data }) {
    this.uid = uid
    this.locationId = locationId
    this.taskId = taskId
    this.data = data
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const task = await ConfiguredTask.findOneAndUpdate(
      { _id: this.taskId, clientId, locationId: this.locationId },
      { $set: this.data },
      { new: true }
    )
    if (!task) throw Boom.notFound('Task not found')
    return task
  }
}
