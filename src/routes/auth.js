import { RegisterUser } from '../commands/auth/RegisterUser.js'
import { AddFcmToken } from '../commands/auth/AddFcmToken.js'
import { RemoveFcmToken } from '../commands/auth/RemoveFcmToken.js'

export function registerAuthRoutes(server) {
  server.route([
    {
      method: 'POST',
      path: '/api/auth/register',
      options: { auth: false },
      handler: (request) => new RegisterUser(request.payload).execute(),
    },
    {
      method: 'POST',
      path: '/api/auth/fcm-token',
      handler: (request) => new AddFcmToken({ uid: request.auth.credentials.uid, token: request.payload.token }).execute(),
    },
    {
      method: 'DELETE',
      path: '/api/auth/fcm-token',
      handler: (request) => new RemoveFcmToken({ uid: request.auth.credentials.uid, token: request.payload.token }).execute(),
    },
  ])
}
