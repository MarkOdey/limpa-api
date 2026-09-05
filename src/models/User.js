import mongoose from 'mongoose'

// Unified account/identity record. Role-specific data still lives in the
// Client and Cleaner profile documents (joined by firebaseUid); the User is the
// source of truth for identity and access (the `roles` array).
//
//   client — can request cleanings (has a Client profile)
//   worker — can clean / accept jobs (has a Cleaner profile)
//   admin  — god-mode operations
export const ROLES = ['client', 'worker', 'admin']

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  avatarUrl: { type: String },
  roles: [{ type: String, enum: ROLES }],
}, { timestamps: true })

export const User = mongoose.model('User', userSchema)
