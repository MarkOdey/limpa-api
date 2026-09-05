import Boom from '@hapi/boom'
import { User, ROLES } from '../../models/User.js'
import { assertAdmin } from '../_helpers/getUser.js'

export class UpdateUserRoles {
  constructor({ uid, userId, roles }) {
    this.uid = uid
    this.userId = userId
    this.roles = roles
  }

  async execute() {
    const admin = await assertAdmin(this.uid)

    if (!Array.isArray(this.roles) || this.roles.some((r) => !ROLES.includes(r))) {
      throw Boom.badRequest(`roles must be a subset of: ${ROLES.join(', ')}`)
    }
    const roles = [...new Set(this.roles)]

    // Guard against an admin removing their own admin role and locking everyone
    // out — only block it when they are the last remaining admin.
    if (String(admin._id) === String(this.userId) && !roles.includes('admin')) {
      const adminCount = await User.countDocuments({ roles: 'admin' })
      if (adminCount <= 1) throw Boom.badRequest('Cannot remove the last admin')
    }

    const user = await User.findByIdAndUpdate(
      this.userId,
      { $set: { roles } },
      { new: true },
    ).select('email firstName lastName roles')
    if (!user) throw Boom.notFound('User not found')
    return user
  }
}
