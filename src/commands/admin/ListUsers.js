import { User } from '../../models/User.js'
import { assertAdmin } from '../_helpers/getUser.js'

export class ListUsers {
  constructor({ uid }) {
    this.uid = uid
  }

  async execute() {
    await assertAdmin(this.uid)
    const users = await User.find().sort({ createdAt: -1 }).select('email firstName lastName roles createdAt')
    return users
  }
}
