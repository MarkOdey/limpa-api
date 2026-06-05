import mongoose from 'mongoose'

const configuredTaskSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null },
  name: { type: String, required: true },
  status: { type: String, enum: ['active', 'pending'], default: 'active' },
  targetType: { type: String, enum: ['room', 'area', 'all'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, default: null },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', 'once'],
    required: true,
  },
}, { timestamps: true })

export const ConfiguredTask = mongoose.model('ConfiguredTask', configuredTaskSchema)
