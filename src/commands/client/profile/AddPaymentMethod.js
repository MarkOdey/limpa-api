import Boom from '@hapi/boom'

export class AddPaymentMethod {
  constructor({ uid, stripeToken, isDefault }) {
    this.uid = uid
    this.stripeToken = stripeToken
    this.isDefault = isDefault
  }

  async execute() {
    // TODO: attach Stripe payment method and store token
    throw Boom.notImplemented()
  }
}
