import mongoose from 'mongoose'

const paymentMethodSchema = new mongoose.Schema({
  provider: { type: String, required: true },
  token: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { _id: false })

const clientSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  fcmTokens: [{ type: String }],
  paymentMethods: [paymentMethodSchema],
}, { timestamps: true })

export const Client = mongoose.model('Client', clientSchema)
