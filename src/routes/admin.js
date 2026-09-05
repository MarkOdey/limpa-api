import { ListUsers } from '../commands/admin/ListUsers.js'
import { UpdateUserRoles } from '../commands/admin/UpdateUserRoles.js'
import { GetStats } from '../commands/admin/GetStats.js'

// God-mode operations. Every handler asserts the caller has the admin role.
export function registerAdminRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/admin/stats',
      handler: (request) => new GetStats({ uid: request.auth.credentials.uid }).execute(),
    },
    {
      method: 'GET',
      path: '/api/admin/users',
      handler: (request) => new ListUsers({ uid: request.auth.credentials.uid }).execute(),
    },
    {
      method: 'PATCH',
      path: '/api/admin/users/{id}/roles',
      handler: (request) => new UpdateUserRoles({
        uid: request.auth.credentials.uid,
        userId: request.params.id,
        roles: request.payload.roles,
      }).execute(),
    },
  ])
}
