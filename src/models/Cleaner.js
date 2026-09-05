import mongoose from 'mongoose'

const taskModifierSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  modifier: { type: Number, required: true },
}, { _id: false })

const cleanerSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  avatarUrl: { type: String },
  bio: { type: String },
  fcmTokens: [{ type: String }],
  yearsOfExperience: { type: Number, default: 0 },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  reputationScore: { type: Number, default: 0 },
  completedJobCount: { type: Number, default: 0 },
  stripeAccountId: { type: String },
  availability: {
    preferredDays: [{ type: String }],
    preferredHourStart: { type: Number },
    preferredHourEnd: { type: Number },
  },
  serviceArea: {
    type: { type: String, enum: ['Point'] },
    coordinates: [{ type: Number }],
  },
  taskModifiers: [taskModifierSchema],
}, { timestamps: true })

cleanerSchema.index({ serviceArea: '2dsphere' }, { sparse: true })

export const Cleaner = mongoose.model('Cleaner', cleanerSchema)
