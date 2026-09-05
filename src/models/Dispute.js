import mongoose from 'mongoose'

const disputedTodoSchema = new mongoose.Schema({
  todoId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  clientExplanation: { type: String },
  clientProofUrls: [{ type: String }],
  cleanerResponse: { type: String },
}, { _id: false })

const disputeSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  cleanerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cleaner', required: true },
  status: {
    type: String,
    enum: ['open', 'cleaner_contested', 'resolved'],
    default: 'open',
  },
  resolution: { type: String, enum: ['reimbursed', 'upheld', null], default: null },
  disputedTodos: [disputedTodoSchema],
  thirdPartyNotes: { type: String },
  resolvedAt: { type: Date },
}, { timestamps: true })

export const Dispute = mongoose.model('Dispute', disputeSchema)
