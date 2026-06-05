import Boom from '@hapi/boom'

export class RemoveFcmToken {
  constructor({ uid, token }) {
    this.uid = uid
    this.token = token
  }

  async execute() {
    // TODO: pull token from fcmTokens array on logout
    throw Boom.notImplemented()
  }
}
