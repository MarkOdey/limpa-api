import { GetCleanerSessions } from '../../commands/cleaner/sessions/GetCleanerSessions.js'
import { GetCleanerSession } from '../../commands/cleaner/sessions/GetCleanerSession.js'
import { StartSession } from '../../commands/cleaner/sessions/StartSession.js'
import { UpdateTodoStatus } from '../../commands/cleaner/sessions/UpdateTodoStatus.js'
import { CompleteSession } from '../../commands/cleaner/sessions/CompleteSession.js'
import { NotifyAvailable } from '../../commands/cleaner/sessions/NotifyAvailable.js'

export function registerCleanerSessionRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/cleaner/sessions',
      handler: (request) => new GetCleanerSessions({ uid: request.auth.credentials.uid }).execute(),
    },
    {
      method: 'GET',
      path: '/api/cleaner/sessions/{id}',
      handler: (request) => new GetCleanerSession({ uid: request.auth.credentials.uid, sessionId: request.params.id }).execute(),
    },
    {
      method: 'POST',
      path: '/api/cleaner/sessions/{id}/start',
      handler: (request) => new StartSession({ uid: request.auth.credentials.uid, sessionId: request.params.id }).execute(),
    },
    {
      method: 'PATCH',
      path: '/api/cleaner/sessions/{id}/todos/{todoId}',
      handler: (request) => new UpdateTodoStatus({ uid: request.auth.credentials.uid, sessionId: request.params.id, todoId: request.params.todoId, status: request.payload.status }).execute(),
    },
    {
      method: 'POST',
      path: '/api/cleaner/sessions/{id}/complete',
      handler: (request) => new CompleteSession({ uid: request.auth.credentials.uid, sessionId: request.params.id }).execute(),
    },
    {
      method: 'POST',
      path: '/api/cleaner/sessions/{id}/notify-available',
      handler: (request) => new NotifyAvailable({ uid: request.auth.credentials.uid, sessionId: request.params.id }).execute(),
    },
  ])
}
