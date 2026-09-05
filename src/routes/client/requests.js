import { CreateServiceRequest } from '../../commands/client/requests/CreateServiceRequest.js'
import { GetServiceRequests } from '../../commands/client/requests/GetServiceRequests.js'
import { GetServiceRequest } from '../../commands/client/requests/GetServiceRequest.js'
import { UpdateRequestTodos } from '../../commands/client/requests/UpdateRequestTodos.js'
import { CancelRequest } from '../../commands/client/requests/CancelRequest.js'

export function registerClientRequestRoutes(server) {
  server.route([
    {
      method: 'POST',
      path: '/api/client/requests',
      handler: (request) => new CreateServiceRequest({ uid: request.auth.credentials.uid, ...request.payload }).execute(),
    },
    {
      method: 'GET',
      path: '/api/client/requests',
      handler: (request) => new GetServiceRequests({ uid: request.auth.credentials.uid, locationId: request.query.locationId }).execute(),
    },
    {
      method: 'GET',
      path: '/api/client/requests/{id}',
      handler: (request) => new GetServiceRequest({ uid: request.auth.credentials.uid, requestId: request.params.id }).execute(),
    },
    {
      method: 'PATCH',
      path: '/api/client/requests/{id}/todos',
      handler: (request) => new UpdateRequestTodos({ uid: request.auth.credentials.uid, requestId: request.params.id, ...request.payload }).execute(),
    },
    {
      method: 'PATCH',
      path: '/api/client/requests/{id}/cancel',
      handler: (request) => new CancelRequest({ uid: request.auth.credentials.uid, requestId: request.params.id }).execute(),
    },
  ])
}
