import { GetCleanerDisputes } from '../../commands/cleaner/disputes/GetCleanerDisputes.js'
import { GetCleanerDispute } from '../../commands/cleaner/disputes/GetCleanerDispute.js'
import { ContestDispute } from '../../commands/cleaner/disputes/ContestDispute.js'

export function registerCleanerDisputeRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/cleaner/disputes',
      handler: (request) => new GetCleanerDisputes({ uid: request.auth.credentials.uid }).execute(),
    },
    {
      method: 'GET',
      path: '/api/cleaner/disputes/{id}',
      handler: (request) => new GetCleanerDispute({ uid: request.auth.credentials.uid, disputeId: request.params.id }).execute(),
    },
    {
      method: 'POST',
      path: '/api/cleaner/disputes/{id}/contest',
      handler: (request) => new ContestDispute({ uid: request.auth.credentials.uid, disputeId: request.params.id, disputedTodos: request.payload.disputedTodos }).execute(),
    },
  ])
}
