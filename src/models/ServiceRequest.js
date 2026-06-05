import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
  configuredTaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'ConfiguredTask' },
  name: { type: String, required: true },
  roomOrAreaName: { type: String },
  frequency: { type: String },
  status: {
    type: String,
    enum: ['pending', 'done', 'not_needed', 'incomplete'],
    default: 'pending',
  },
})

const serviceRequestSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  status: {
    type: String,
    enum: ['open', 'accepted', 'cancelled', 'completed'],
    default: 'open',
  },
  isRecurring: { type: Boolean, default: false },
  recurringFrequency: { type: String, enum: ['weekly', 'biweekly', 'monthly', null], default: null },
  nextBroadcastAt: { type: Date },
  preferredDays: [{ type: String }],
  preferredHourStart: { type: Number },
  preferredHourEnd: { type: Number },
  estimatedCost: { type: Number },
  todoList: [todoSchema],
  broadcastedAt: { type: Date },
}, { timestamps: true })

export const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema)
