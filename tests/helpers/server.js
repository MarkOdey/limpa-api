import Hapi from '@hapi/hapi'
import { registerRoutes } from '../../src/routes/index.js'

/**
 * Builds a test Hapi server with a no-op auth scheme.
 * All model imports are expected to be mocked by the calling test file via vi.mock().
 */
export async function buildTestServer(credentials = { uid: 'test-uid', role: 'client' }) {
  const server = Hapi.server({ port: 3000, host: 'localhost' })

  server.auth.scheme('firebase-jwt', () => ({
    authenticate: (_request, h) => h.authenticated({ credentials }),
  }))
  server.auth.strategy('firebase', 'firebase-jwt')
  server.auth.default('firebase')

  registerRoutes(server)
  await server.initialize()
  return server
}
