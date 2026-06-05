import { GetCleanerRequests } from '../../commands/cleaner/requests/GetCleanerRequests.js'
import { GetCleanerRequest } from '../../commands/cleaner/requests/GetCleanerRequest.js'
import { SubmitProposal } from '../../commands/cleaner/requests/SubmitProposal.js'
import { WithdrawProposal } from '../../commands/cleaner/requests/WithdrawProposal.js'
import { AcceptCounterProposal } from '../../commands/cleaner/requests/AcceptCounterProposal.js'

export function registerCleanerRequestRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/cleaner/requests',
      handler: (request) => new GetCleanerRequests({ uid: request.auth.credentials.uid }).execute(),
    },
    {
      method: 'GET',
      path: '/api/cleaner/requests/{id}',
      handler: (request) => new GetCleanerRequest({ requestId: request.params.id }).execute(),
    },
    {
      method: 'POST',
      path: '/api/cleaner/requests/{id}/propose',
      handler: (request) => new SubmitProposal({ uid: request.auth.credentials.uid, requestId: request.params.id, data: request.payload }).execute(),
    },
    {
      method: 'PATCH',
      path: '/api/cleaner/proposals/{id}/withdraw',
      handler: (request) => new WithdrawProposal({ uid: request.auth.credentials.uid, proposalId: request.params.id }).execute(),
    },
    {
      method: 'POST',
      path: '/api/cleaner/proposals/{id}/counter-accept',
      handler: (request) => new AcceptCounterProposal({ uid: request.auth.credentials.uid, proposalId: request.params.id }).execute(),
    },
  ])
}
