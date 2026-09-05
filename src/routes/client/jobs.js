import { GetClientJobs } from '../../commands/client/jobs/GetClientJobs.js'
import { GetClientJob } from '../../commands/client/jobs/GetClientJob.js'
import { RaiseDispute } from '../../commands/client/jobs/RaiseDispute.js'

export function registerClientJobRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/client/jobs',
      handler: (request) => new GetClientJobs({ uid: request.auth.credentials.uid }).execute(),
    },
    {
      method: 'GET',
      path: '/api/client/jobs/{id}',
      handler: (request) => new GetClientJob({ uid: request.auth.credentials.uid, jobId: request.params.id }).execute(),
    },
    {
      method: 'POST',
      path: '/api/client/jobs/{id}/dispute',
      handler: (request) => new RaiseDispute({ uid: request.auth.credentials.uid, jobId: request.params.id, disputedTodos: request.payload.disputedTodos }).execute(),
    },
  ])
}
