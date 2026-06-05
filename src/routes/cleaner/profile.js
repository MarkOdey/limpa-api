import { GetCleanerProfile } from '../../commands/cleaner/profile/GetCleanerProfile.js'
import { UpdateCleanerProfile } from '../../commands/cleaner/profile/UpdateCleanerProfile.js'
import { UpdateAvailability } from '../../commands/cleaner/profile/UpdateAvailability.js'
import { UpdateTaskModifiers } from '../../commands/cleaner/profile/UpdateTaskModifiers.js'
import { GetPublicProfile } from '../../commands/cleaner/profile/GetPublicProfile.js'

export function registerCleanerProfileRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/cleaner/profile',
      handler: (request) => new GetCleanerProfile({ uid: request.auth.credentials.uid }).execute(),
    },
    {
      method: 'PATCH',
      path: '/api/cleaner/profile',
      handler: (request) => new UpdateCleanerProfile({ uid: request.auth.credentials.uid, data: request.payload }).execute(),
    },
    {
      method: 'PATCH',
      path: '/api/cleaner/profile/availability',
      handler: (request) => new UpdateAvailability({ uid: request.auth.credentials.uid, availability: request.payload }).execute(),
    },
    {
      method: 'PATCH',
      path: '/api/cleaner/profile/task-modifiers',
      handler: (request) => new UpdateTaskModifiers({ uid: request.auth.credentials.uid, taskModifiers: request.payload.taskModifiers }).execute(),
    },
    {
      method: 'GET',
      path: '/api/cleaner/profile/{id}/public',
      options: { auth: false },
      handler: (request) => new GetPublicProfile({ cleanerId: request.params.id }).execute(),
    },
  ])
}
