import mongoose from 'mongoose'

// Catalog of placeable furniture items. Mirrors the Task catalog: a browse path
// filtered by applicableRoomTypes, and a name search that ignores room type.
const furnitureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  kind: { type: String, required: true },        // stable catalog key, e.g. 'toilet'
  icon: { type: String, required: true },        // mdi icon name, e.g. 'mdi-toilet'
  applicableRoomTypes: [{ type: String }],
  defaultSize: {
    width: { type: Number, default: 40 },
    height: { type: Number, default: 40 },
  },
  status: { type: String, enum: ['active', 'deprecated'], default: 'active' },
}, { timestamps: true })

export const Furniture = mongoose.model('Furniture', furnitureSchema)
