import { ListFurniture } from '../../commands/client/furniture/ListFurniture.js'
import { SearchFurniture } from '../../commands/client/furniture/SearchFurniture.js'

export function registerClientFurnitureRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/furniture',
      options: { auth: false },
      handler: (request) => new ListFurniture({ roomType: request.query.roomType || '' }).execute(),
    },
    {
      method: 'GET',
      path: '/api/furniture/search',
      options: { auth: false },
      handler: (request) => new SearchFurniture({ q: request.query.q || '' }).execute(),
    },
  ])
}
