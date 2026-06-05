import { GetClientProfile } from '../../commands/client/profile/GetClientProfile.js'
import { UpdateClientProfile } from '../../commands/client/profile/UpdateClientProfile.js'
import { AddPaymentMethod } from '../../commands/client/profile/AddPaymentMethod.js'
import { RemovePaymentMethod } from '../../commands/client/profile/RemovePaymentMethod.js'

export function registerClientProfileRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/client/profile',
      handler: (request) => new GetClientProfile({ uid: request.auth.credentials.uid }).execute(),
    },
    {
      method: 'PATCH',
      path: '/api/client/profile',
      handler: (request) => new UpdateClientProfile({ uid: request.auth.credentials.uid, data: request.payload }).execute(),
    },
    {
      method: 'POST',
      path: '/api/client/payment-methods',
      handler: (request) => new AddPaymentMethod({ uid: request.auth.credentials.uid, ...request.payload }).execute(),
    },
    {
      method: 'DELETE',
      path: '/api/client/payment-methods/{id}',
      handler: (request) => new RemovePaymentMethod({ uid: request.auth.credentials.uid, paymentMethodId: request.params.id }).execute(),
    },
  ])
}
