import Boom from '@hapi/boom'
import { User } from '../../models/User.js'
import { Client } from '../../models/Client.js'
import { Cleaner } from '../../models/Cleaner.js'

// Resolve the unified User for a firebase uid.
//
// Accounts created before the User model existed only have a Client and/or
// Cleaner profile document. To avoid a destructive migration we derive a User
// on first read: look up the legacy profiles, infer the roles from which ones
// exist, and persist a User so subsequent reads are cheap.
export async function resolveUser(uid) {
  let user = await User.findOne({ firebaseUid: uid })
  if (user) return user

  const [client, cleaner] = await Promise.all([
    Client.findOne({ firebaseUid: uid }),
    Cleaner.findOne({ firebaseUid: uid }),
  ])
  const profile = client || cleaner
  if (!profile) return null

  const roles = []
  if (client) roles.push('client')
  if (cleaner) roles.push('worker')

  user = await User.create({
    firebaseUid: uid,
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    roles,
  })
  return user
}

// Same as resolveUser but throws 404 when there is no account at all.
export async function getUser(uid) {
  const user = await resolveUser(uid)
  if (!user) throw Boom.notFound('User not found')
  return user
}

// Guard for admin-only (god-mode) operations.
export async function assertAdmin(uid) {
  const user = await getUser(uid)
  if (!user.roles?.includes('admin')) throw Boom.forbidden('Admin access required')
  return user
}
