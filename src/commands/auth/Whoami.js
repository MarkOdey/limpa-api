import { getUser } from '../_helpers/getUser.js'

export class Whoami {
  constructor({ uid }) {
    this.uid = uid
  }

  async execute() {
    const user = await getUser(this.uid)
    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles ?? [],
    }
  }
}
