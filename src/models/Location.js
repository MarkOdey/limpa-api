import mongoose from 'mongoose'

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  position: { x: { type: Number, default: 0 }, y: { type: Number, default: 0 } },
  size: { width: { type: Number, default: 100 }, height: { type: Number, default: 100 } },
})

const levelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rooms: [roomSchema],
})

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
  },
  land: {
    areas: [areaSchema],
  },
}, { timestamps: true })

locationSchema.index({ coordinates: '2dsphere' }, { sparse: true })

export const Location = mongoose.model('Location', locationSchema)
