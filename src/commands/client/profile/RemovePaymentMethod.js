import Boom from '@hapi/boom'

export class RemovePaymentMethod {
  constructor({ uid, paymentMethodId }) {
    this.uid = uid
    this.paymentMethodId = paymentMethodId
  }

  async execute() {
    // TODO: remove payment method by id
    throw Boom.notImplemented()
  }
}
