import mongoose from 'mongoose'

const baseRateSchema = new mongoose.Schema({
  region: { type: String, required: true },
  price: { type: Number, required: true },
}, { _id: false })

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  defaultFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', 'once'],
    required: true,
  },
  applicableRoomTypes: [{ type: String }],
  baseRates: [baseRateSchema],
  status: { type: String, enum: ['active', 'pending', 'deprecated'], default: 'active' },
}, { timestamps: true })

export const Task = mongoose.model('Task', taskSchema)
