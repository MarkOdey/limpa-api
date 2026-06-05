import { GetLocations } from '../../commands/client/locations/GetLocations.js'
import { CreateLocation } from '../../commands/client/locations/CreateLocation.js'
import { GetLocation } from '../../commands/client/locations/GetLocation.js'
import { UpdateLocation } from '../../commands/client/locations/UpdateLocation.js'
import { DeleteLocation } from '../../commands/client/locations/DeleteLocation.js'
import { UpdateBuilding } from '../../commands/client/locations/UpdateBuilding.js'
import { UpdateLand } from '../../commands/client/locations/UpdateLand.js'

export function registerClientLocationRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/client/locations',
      handler: (request) => new GetLocations({ uid: request.auth.credentials.uid }).execute(),
    },
    {
      method: 'POST',
      path: '/api/client/locations',
      handler: (request) => new CreateLocation({ uid: request.auth.credentials.uid, data: request.payload }).execute(),
    },
    {
      method: 'GET',
      path: '/api/client/locations/{id}',
      handler: (request) => new GetLocation({ uid: request.auth.credentials.uid, locationId: request.params.id }).execute(),
    },
    {
      method: 'PATCH',
      path: '/api/client/locations/{id}',
      handler: (request) => new UpdateLocation({ uid: request.auth.credentials.uid, locationId: request.params.id, data: request.payload }).execute(),
    },
    {
      method: 'DELETE',
      path: '/api/client/locations/{id}',
      handler: (request) => new DeleteLocation({ uid: request.auth.credentials.uid, locationId: request.params.id }).execute(),
    },
    {
      method: 'PATCH',
      path: '/api/client/locations/{id}/building',
      handler: (request) => new UpdateBuilding({ uid: request.auth.credentials.uid, locationId: request.params.id, building: request.payload }).execute(),
    },
    {
      method: 'PATCH',
      path: '/api/client/locations/{id}/land',
      handler: (request) => new UpdateLand({ uid: request.auth.credentials.uid, locationId: request.params.id, land: request.payload }).execute(),
    },
  ])
}
