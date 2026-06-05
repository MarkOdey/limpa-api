import { GetProposals } from '../../commands/client/proposals/GetProposals.js'
import { GetProposal } from '../../commands/client/proposals/GetProposal.js'
import { AcceptProposal } from '../../commands/client/proposals/AcceptProposal.js'
import { DeclineProposal } from '../../commands/client/proposals/DeclineProposal.js'
import { CounterProposal } from '../../commands/client/proposals/CounterProposal.js'

export function registerClientProposalRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/client/requests/{requestId}/proposals',
      handler: (request) => new GetProposals({ requestId: request.params.requestId }).execute(),
    },
    {
      method: 'GET',
      path: '/api/client/requests/{requestId}/proposals/{id}',
      handler: (request) => new GetProposal({ requestId: request.params.requestId, proposalId: request.params.id }).execute(),
    },
    {
      method: 'POST',
      path: '/api/client/requests/{requestId}/proposals/{id}/accept',
      handler: (request) => new AcceptProposal({ uid: request.auth.credentials.uid, requestId: request.params.requestId, proposalId: request.params.id }).execute(),
    },
    {
      method: 'POST',
      path: '/api/client/requests/{requestId}/proposals/{id}/decline',
      handler: (request) => new DeclineProposal({ uid: request.auth.credentials.uid, requestId: request.params.requestId, proposalId: request.params.id }).execute(),
    },
    {
      method: 'POST',
      path: '/api/client/requests/{requestId}/proposals/{id}/counter',
      handler: (request) => new CounterProposal({ uid: request.auth.credentials.uid, requestId: request.params.requestId, proposalId: request.params.id, counterProposal: request.payload }).execute(),
    },
  ])
}
