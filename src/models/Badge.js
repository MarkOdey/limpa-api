import mongoose from 'mongoose'

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  iconUrl: { type: String },
  rateModifierCeiling: { type: Number, default: 0 },
}, { timestamps: true })

export const Badge = mongoose.model('Badge', badgeSchema)
