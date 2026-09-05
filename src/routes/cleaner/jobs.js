import { GetCleanerJobs } from '../../commands/cleaner/jobs/GetCleanerJobs.js'
import { GetCleanerJob } from '../../commands/cleaner/jobs/GetCleanerJob.js'
import { StartJob } from '../../commands/cleaner/jobs/StartJob.js'
import { UpdateTodoStatus } from '../../commands/cleaner/jobs/UpdateTodoStatus.js'
import { CompleteJob } from '../../commands/cleaner/jobs/CompleteJob.js'
import { NotifyAvailable } from '../../commands/cleaner/jobs/NotifyAvailable.js'

export function registerCleanerJobRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/cleaner/jobs',
      handler: (request) => new GetCleanerJobs({ uid: request.auth.credentials.uid }).execute(),
    },
    {
      method: 'GET',
      path: '/api/cleaner/jobs/{id}',
      handler: (request) => new GetCleanerJob({ uid: request.auth.credentials.uid, jobId: request.params.id }).execute(),
    },
    {
      method: 'POST',
      path: '/api/cleaner/jobs/{id}/start',
      handler: (request) => new StartJob({ uid: request.auth.credentials.uid, jobId: request.params.id }).execute(),
    },
    {
      method: 'PATCH',
      path: '/api/cleaner/jobs/{id}/todos/{todoId}',
      handler: (request) => new UpdateTodoStatus({ uid: request.auth.credentials.uid, jobId: request.params.id, todoId: request.params.todoId, status: request.payload.status }).execute(),
    },
    {
      method: 'POST',
      path: '/api/cleaner/jobs/{id}/complete',
      handler: (request) => new CompleteJob({ uid: request.auth.credentials.uid, jobId: request.params.id }).execute(),
    },
    {
      method: 'POST',
      path: '/api/cleaner/jobs/{id}/notify-available',
      handler: (request) => new NotifyAvailable({ uid: request.auth.credentials.uid, jobId: request.params.id }).execute(),
    },
  ])
}
