import Boom from '@hapi/boom'
import { ConfiguredTask } from '../../../models/ConfiguredTask.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class DeleteLocationTask {
  constructor({ uid, locationId, taskId }) {
    this.uid = uid
    this.locationId = locationId
    this.taskId = taskId
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const result = await ConfiguredTask.deleteOne({ _id: this.taskId, clientId, locationId: this.locationId })
    if (!result.deletedCount) throw Boom.notFound('Task not found')
    return { success: true }
  }
}
