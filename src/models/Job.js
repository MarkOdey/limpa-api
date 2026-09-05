import mongoose from 'mongoose'

const jobTodoSchema = new mongoose.Schema({
  // Kept so a completed job records which configured task was performed and when
  // — this is what drives "last time the task was done" for future requests.
  configuredTaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'ConfiguredTask' },
  name: { type: String, required: true },
  roomOrAreaName: { type: String },
  status: { type: String, enum: ['done', 'not_needed', 'incomplete'] },
  completedAt: { type: Date },
})

const jobSchema = new mongoose.Schema({
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
  todoList: [jobTodoSchema],
  billedAmount: { type: Number },
  platformFee: { type: Number },
  stripe: {
    paymentIntentId: { type: String },
    transferId: { type: String },
    chargeId: { type: String },
    refundId: { type: String },
  },
}, { timestamps: true })

export const Job = mongoose.model('Job', jobSchema)
