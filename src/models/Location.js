import mongoose from 'mongoose'

const furnitureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  kind: { type: String, required: true },        // catalog key, e.g. 'toilet'
  icon: { type: String },                        // mdi icon name
  position: { x: { type: Number, default: 0 }, y: { type: Number, default: 0 } },
  size: { width: { type: Number, default: 40 }, height: { type: Number, default: 40 } },
  // Free-form per-instance parameters that drive type-specific rendering on the
  // client (e.g. a couch's `seats`). The set of keys is defined by the client
  // furniture registry for each `kind`; stored here so choices persist.
  params: { type: mongoose.Schema.Types.Mixed, default: {} },
})

const openingSchema = new mongoose.Schema({
  type: { type: String, enum: ['door', 'window', 'portal'], required: true },
  side: { type: String, enum: ['top', 'right', 'bottom', 'left'], required: true },
  offset: { type: Number, default: 0 },   // px along the wall from its start corner
  length: { type: Number, default: 48 },  // px
})

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  position: { x: { type: Number, default: 0 }, y: { type: Number, default: 0 } },
  size: { width: { type: Number, default: 100 }, height: { type: Number, default: 100 } },
  furniture: [furnitureSchema],
  openings: [openingSchema],
})

const levelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rooms: [roomSchema],
})

// Wall thicknesses in metres. Defaults follow common architectural / ISO
// practice: ~0.30 m exterior (outer) walls, ~0.10 m interior (inner) partitions.
const wallsSchema = new mongoose.Schema({
  inner: { type: Number, default: 0.10 },
  outer: { type: Number, default: 0.30 },
}, { _id: false })

const areaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['garden', 'driveway', 'pool', 'patio', 'other'], required: true },
})

const locationSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  coordinates: {
    type: { type: String, enum: ['Point'] },
    coordinates: [{ type: Number }],
  },
  building: {
    levels: [levelSchema],
    walls: { type: wallsSchema, default: () => ({}) },
  },
  land: {
    areas: [areaSchema],
  },
}, { timestamps: true })

locationSchema.index({ coordinates: '2dsphere' }, { sparse: true })

export const Location = mongoose.model('Location', locationSchema)
