import mongoose from 'mongoose'

const sessionTodoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roomOrAreaName: { type: String },
  status: { type: String, enum: ['done', 'not_needed', 'incomplete'] },
  completedAt: { type: Date },
})

const sessionSchema = new mongoose.Schema({
  serviceRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
  proposalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  cleanerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cleaner', required: true },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'disputed'],
    default: 'scheduled',
  },
  scheduledDate: { type: Date, required: true },
  hourStart: { type: Number, required: true },
  hourEnd: { type: Number, required: true },
  startedAt: { type: Date },
  completedAt: { type: Date },
  todoList: [sessionTodoSchema],
  billedAmount: { type: Number },
  platformFee: { type: Number },
  stripe: {
    paymentIntentId: { type: String },
    transferId: { type: String },
    chargeId: { type: String },
    refundId: { type: String },
  },
}, { timestamps: true })

export const Session = mongoose.model('Session', sessionSchema)
