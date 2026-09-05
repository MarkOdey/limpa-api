import { ServiceRequest } from '../../../models/ServiceRequest.js'
import { ConfiguredTask } from '../../../models/ConfiguredTask.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class CreateServiceRequest {
  constructor({ uid, locationId, preferredDays, preferredHourStart, preferredHourEnd, isRecurring, recurringFrequency, taskIds }) {
    this.uid = uid
    this.locationId = locationId
    this.preferredDays = preferredDays
    this.preferredHourStart = preferredHourStart
    this.preferredHourEnd = preferredHourEnd
    this.isRecurring = isRecurring
    this.recurringFrequency = recurringFrequency
    // Selected configured-task ids to include as todos. When omitted, all active
    // configured tasks are included (backward-compatible default).
    this.taskIds = taskIds
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const filter = { clientId, locationId: this.locationId, status: 'active' }
    if (Array.isArray(this.taskIds)) filter._id = { $in: this.taskIds }
    const configuredTasks = await ConfiguredTask.find(filter)
    const todoList = configuredTasks.map((t) => ({
      configuredTaskId: t._id,
      name: t.name,
      frequency: t.frequency,
      status: 'pending',
    }))

    return ServiceRequest.create({
      clientId,
      locationId: this.locationId,
      preferredDays: this.preferredDays,
      preferredHourStart: this.preferredHourStart,
      preferredHourEnd: this.preferredHourEnd,
      isRecurring: !!this.isRecurring,
      recurringFrequency: this.isRecurring ? this.recurringFrequency : null,
      todoList,
      broadcastedAt: new Date(),
    })
  }
}
