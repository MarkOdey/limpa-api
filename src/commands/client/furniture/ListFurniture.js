import { Furniture } from '../../../models/Furniture.js'

// Browse the catalog filtered by room type. With no roomType, returns everything active.
export class ListFurniture {
  constructor({ roomType }) {
    this.roomType = roomType
  }

  async execute() {
    const query = { status: 'active' }
    if (this.roomType) query.applicableRoomTypes = this.roomType
    const furniture = await Furniture.find(query)
    return { furniture }
  }
}
