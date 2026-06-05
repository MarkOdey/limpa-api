import Boom from '@hapi/boom'

export class AddFcmToken {
  constructor({ uid, token }) {
    this.uid = uid
    this.token = token
  }

  async execute() {
    // TODO: push token into fcmTokens array for the authenticated user
    throw Boom.notImplemented()
  }
}
