import Boom from '@hapi/boom'
import { Client } from '../../models/Client.js'
import { Cleaner } from '../../models/Cleaner.js'
import { User } from '../../models/User.js'

// Accepts the caller-facing role name ('client' or 'cleaner'/'worker') and maps
// it to a profile collection plus the unified-User role.
const ROLE_MAP = {
  client: { role: 'client', Model: Client },
  cleaner: { role: 'worker', Model: Cleaner },
  worker: { role: 'worker', Model: Cleaner },
}

export class RegisterUser {
  constructor({ role, firebaseUid, email, firstName, lastName, phone }) {
    this.role = role
    this.firebaseUid = firebaseUid
    this.email = email
    this.firstName = firstName
    this.lastName = lastName
    this.phone = phone
  }

  async execute() {
    const { role, firebaseUid, email, firstName, lastName, phone } = this
    const mapping = ROLE_MAP[role]
    if (!mapping) throw Boom.badRequest('Invalid role')

    // Create the role-specific profile document.
    const existing = await mapping.Model.findOne({ firebaseUid })
    if (existing) throw Boom.conflict('Account already registered for this role')
    const profile = await mapping.Model.create({ firebaseUid, email, firstName, lastName, phone })

    // Create or extend the unified User, adding the granted role.
    const user = await User.findOneAndUpdate(
      { firebaseUid },
      {
        $setOnInsert: { firebaseUid, email, firstName, lastName, phone },
        $addToSet: { roles: mapping.role },
      },
      { new: true, upsert: true },
    )

    return { _id: profile._id, firebaseUid, email, firstName, lastName, roles: user.roles, createdAt: profile.createdAt }
  }
}
