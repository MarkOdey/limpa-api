import { Furniture } from '../../../models/Furniture.js'

// Global name search across the whole catalog — deliberately ignores room type
// so a search bypasses the room-type filter.
export class SearchFurniture {
  constructor({ q }) {
    this.q = q
  }

  async execute() {
    const furniture = await Furniture.find({
      name: { $regex: this.q, $options: 'i' },
      status: 'active',
    }).limit(20)
    return { furniture }
  }
}
