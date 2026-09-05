import { registerAuthRoutes } from './auth.js'
import { registerAdminRoutes } from './admin.js'
import { registerClientProfileRoutes } from './client/profile.js'
import { registerClientLocationRoutes } from './client/locations.js'
import { registerClientTaskRoutes } from './client/tasks.js'
import { registerClientFurnitureRoutes } from './client/furniture.js'
import { registerClientRequestRoutes } from './client/requests.js'
import { registerClientProposalRoutes } from './client/proposals.js'
import { registerClientJobRoutes } from './client/jobs.js'
import { registerCleanerProfileRoutes } from './cleaner/profile.js'
import { registerCleanerRequestRoutes } from './cleaner/requests.js'
import { registerCleanerJobRoutes } from './cleaner/jobs.js'
import { registerCleanerDisputeRoutes } from './cleaner/disputes.js'

export function registerRoutes(server) {
  registerAuthRoutes(server)
  registerAdminRoutes(server)
  registerClientProfileRoutes(server)
  registerClientLocationRoutes(server)
  registerClientTaskRoutes(server)
  registerClientFurnitureRoutes(server)
  registerClientRequestRoutes(server)
  registerClientProposalRoutes(server)
  registerClientJobRoutes(server)
  registerCleanerProfileRoutes(server)
  registerCleanerRequestRoutes(server)
  registerCleanerJobRoutes(server)
  registerCleanerDisputeRoutes(server)
}
