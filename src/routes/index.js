import { registerAuthRoutes } from './auth.js'
import { registerClientProfileRoutes } from './client/profile.js'
import { registerClientLocationRoutes } from './client/locations.js'
import { registerClientTaskRoutes } from './client/tasks.js'
import { registerClientRequestRoutes } from './client/requests.js'
import { registerClientProposalRoutes } from './client/proposals.js'
import { registerClientSessionRoutes } from './client/sessions.js'
import { registerCleanerProfileRoutes } from './cleaner/profile.js'
import { registerCleanerRequestRoutes } from './cleaner/requests.js'
import { registerCleanerSessionRoutes } from './cleaner/sessions.js'
import { registerCleanerDisputeRoutes } from './cleaner/disputes.js'

export function registerRoutes(server) {
  registerAuthRoutes(server)
  registerClientProfileRoutes(server)
  registerClientLocationRoutes(server)
  registerClientTaskRoutes(server)
  registerClientRequestRoutes(server)
  registerClientProposalRoutes(server)
  registerClientSessionRoutes(server)
  registerCleanerProfileRoutes(server)
  registerCleanerRequestRoutes(server)
  registerCleanerSessionRoutes(server)
  registerCleanerDisputeRoutes(server)
}
