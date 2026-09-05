import { assertAdmin } from '../_helpers/getUser.js'
import { User } from '../../models/User.js'
import { Client } from '../../models/Client.js'
import { Cleaner } from '../../models/Cleaner.js'
import { Location } from '../../models/Location.js'
import { ConfiguredTask } from '../../models/ConfiguredTask.js'
import { ServiceRequest } from '../../models/ServiceRequest.js'
import { Proposal } from '../../models/Proposal.js'
import { Session } from '../../models/Session.js'
import { Dispute } from '../../models/Dispute.js'
import { Task } from '../../models/Task.js'

// God-mode overview: a live count of every collection.
export class GetStats {
  constructor({ uid }) {
    this.uid = uid
  }

  async execute() {
    await assertAdmin(this.uid)

    const [users, clients, cleaners, locations, configuredTasks, requests, proposals, sessions, disputes, tasks] =
      await Promise.all([
        User.countDocuments(),
        Client.countDocuments(),
        Cleaner.countDocuments(),
        Location.countDocuments(),
        ConfiguredTask.countDocuments(),
        ServiceRequest.countDocuments(),
        Proposal.countDocuments(),
        Session.countDocuments(),
        Dispute.countDocuments(),
        Task.countDocuments(),
      ])

    return { users, clients, cleaners, locations, configuredTasks, requests, proposals, sessions, disputes, tasks }
  }
}
