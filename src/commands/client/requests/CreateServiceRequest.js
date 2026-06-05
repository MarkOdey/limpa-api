import { ServiceRequest } from '../../../models/ServiceRequest.js'
import { ConfiguredTask } from '../../../models/ConfiguredTask.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class CreateServiceRequest {
  constructor({ uid, locationId, preferredDays, preferredHourStart, preferredHourEnd, isRecurring, recurringFrequency }) {
    this.uid = uid
    this.locationId = locationId
    this.preferredDays = preferredDays
    this.preferredHourStart = preferredHourStart
    this.preferredHourEnd = preferredHourEnd
    this.isRecurring = isRecurring
    this.recurringFrequency = recurringFrequency
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    const configuredTasks = await ConfiguredTask.find({ clientId, locationId: this.locationId, status: 'active' })
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
