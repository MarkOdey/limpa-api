import { SearchTasks } from '../../commands/client/tasks/SearchTasks.js'
import { GetLocationTasks } from '../../commands/client/tasks/GetLocationTasks.js'
import { CreateLocationTask } from '../../commands/client/tasks/CreateLocationTask.js'
import { UpdateLocationTask } from '../../commands/client/tasks/UpdateLocationTask.js'
import { DeleteLocationTask } from '../../commands/client/tasks/DeleteLocationTask.js'

export function registerClientTaskRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/tasks/search',
      options: { auth: false },
      handler: (request) => new SearchTasks({ q: request.query.q || '' }).execute(),
    },
    {
      method: 'GET',
      path: '/api/client/locations/{locationId}/tasks',
      handler: (request) => new GetLocationTasks({ uid: request.auth.credentials.uid, locationId: request.params.locationId }).execute(),
    },
    {
      method: 'POST',
      path: '/api/client/locations/{locationId}/tasks',
      handler: (request) => new CreateLocationTask({ uid: request.auth.credentials.uid, locationId: request.params.locationId, data: request.payload }).execute(),
    },
    {
      method: 'PATCH',
      path: '/api/client/locations/{locationId}/tasks/{id}',
      handler: (request) => new UpdateLocationTask({ uid: request.auth.credentials.uid, locationId: request.params.locationId, taskId: request.params.id, data: request.payload }).execute(),
    },
    {
      method: 'DELETE',
      path: '/api/client/locations/{locationId}/tasks/{id}',
      handler: (request) => new DeleteLocationTask({ uid: request.auth.credentials.uid, locationId: request.params.locationId, taskId: request.params.id }).execute(),
    },
  ])
}
