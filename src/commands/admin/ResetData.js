import admin from 'firebase-admin'
import { assertAdmin } from '../_helpers/getUser.js'
import config from '../../config.js'
import { seedDemo } from '../../seed.js'

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
import { Furniture } from '../../models/Furniture.js'
import { Badge } from '../../models/Badge.js'

const MODELS = [
  User, Client, Cleaner, Location, ConfiguredTask, ServiceRequest,
  Proposal, Session, Dispute, Task, Furniture, Badge,
]

// Delete every Firebase Auth user. Only runs against the local emulator — we
// never mass-delete users from a real Firebase project, even in god mode.
async function resetFirebaseUsers() {
  if (config.authMode !== 'emulator') return { firebaseCleared: false }
  let deleted = 0
  let pageToken
  do {
    const res = await admin.auth().listUsers(1000, pageToken)
    if (res.users.length) {
      await admin.auth().deleteUsers(res.users.map((u) => u.uid))
      deleted += res.users.length
    }
    pageToken = res.pageToken
  } while (pageToken)
  return { firebaseCleared: true, firebaseUsersDeleted: deleted }
}

// God-mode: wipe all application data (and emulator auth users) and re-seed the
// initial demo dataset.
export class ResetData {
  constructor({ uid }) {
    this.uid = uid
  }

  async execute() {
    await assertAdmin(this.uid)

    await Promise.all(MODELS.map((Model) => Model.deleteMany({})))
    const firebase = await resetFirebaseUsers()
    const seeded = await seedDemo()

    return { ok: true, reset: true, seeded, ...firebase }
  }
}
