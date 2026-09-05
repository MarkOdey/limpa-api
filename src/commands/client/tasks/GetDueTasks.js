import { ConfiguredTask } from '../../../models/ConfiguredTask.js'
import { getClientId } from '../../_helpers/getClientId.js'
import { annotateDueness } from '../../../services/taskDueness.js'

// The active configured tasks for a location, annotated with when each was last
// done and whether it is due now (used to pre-select tasks on a new request).
export class GetDueTasks {
  constructor({ uid, locationId }) {
    this.uid = uid
    this.locationId = locationId
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const configuredTasks = await ConfiguredTask.find({ clientId, locationId: this.locationId, status: 'active' })
    return annotateDueness(clientId, configuredTasks)
  }
}
