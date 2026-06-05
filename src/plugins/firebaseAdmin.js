import admin from 'firebase-admin'
import Boom from '@hapi/boom'
import config from '../config.js'

export const firebaseAdminPlugin = {
  name: 'firebase-admin',
  register: (server) => {
    const usingEmulator = !!process.env.FIREBASE_AUTH_EMULATOR_HOST

    if (!admin.apps.length) {
      if (usingEmulator) {
        admin.initializeApp({ projectId: config.firebase.projectId || 'demo-limpa' })
      } else {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: config.firebase.projectId,
            clientEmail: config.firebase.clientEmail,
            privateKey: config.firebase.privateKey,
          }),
        })
      }
    }

    server.auth.scheme('firebase-jwt', () => ({
      authenticate: async (request, h) => {
        const authHeader = request.headers.authorization
        if (!authHeader?.startsWith('Bearer ')) {
          throw Boom.unauthorized('Missing Bearer token')
        }
        try {
          const decoded = await admin.auth().verifyIdToken(authHeader.slice(7))
          return h.authenticated({ credentials: { uid: decoded.uid, role: decoded.role ?? null } })
        } catch {
          throw Boom.unauthorized('Invalid or expired token')
        }
      },
    }))

    server.auth.strategy('firebase', 'firebase-jwt')
    server.auth.default('firebase')
  },
}
