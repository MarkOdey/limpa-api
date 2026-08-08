import Hapi from '@hapi/hapi'
import { mongoPlugin } from './plugins/mongodb.js'
import { firebaseAdminPlugin } from './plugins/firebaseAdmin.js'
import { registerRoutes } from './routes/index.js'
import config from './config.js'

const init = async () => {
  const server = Hapi.server({
    port: config.port,
    host: config.host,
    routes: { cors: { origin: ['*'] } },
  })

  await server.register([mongoPlugin, firebaseAdminPlugin])
  registerRoutes(server)

  // Health check — handy for load balancers and the demo stack.
  server.route({
    method: 'GET',
    path: '/api/health',
    options: { auth: false },
    handler: () => ({ status: 'ok', demoMode: config.demoMode }),
  })

  if (config.seedDemo) {
    try {
      const { seedDemo } = await import('./seed.js')
      const result = await seedDemo()
      console.log('Demo data seeded:', result)
    } catch (err) {
      console.error('Demo seeding failed (continuing anyway):', err.message)
    }
  }

  await server.start()
  console.log(`Server running on ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

init()
