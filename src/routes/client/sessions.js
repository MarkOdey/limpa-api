import { GetClientSessions } from '../../commands/client/sessions/GetClientSessions.js'
import { GetClientSession } from '../../commands/client/sessions/GetClientSession.js'
import { RaiseDispute } from '../../commands/client/sessions/RaiseDispute.js'

export function registerClientSessionRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/client/sessions',
      handler: (request) => new GetClientSessions({ uid: request.auth.credentials.uid }).execute(),
    },
    {
      method: 'GET',
      path: '/api/client/sessions/{id}',
      handler: (request) => new GetClientSession({ uid: request.auth.credentials.uid, sessionId: request.params.id }).execute(),
    },
    {
      method: 'POST',
      path: '/api/client/sessions/{id}/dispute',
      handler: (request) => new RaiseDispute({ uid: request.auth.credentials.uid, sessionId: request.params.id, disputedTodos: request.payload.disputedTodos }).execute(),
    },
  ])
}
