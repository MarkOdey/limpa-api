import mongoose from 'mongoose'

const taskModificationSchema = new mongoose.Schema({
  todoId: { type: mongoose.Schema.Types.ObjectId, required: true },
  action: { type: String, enum: ['replace', 'price_edit'], required: true },
  replacementTaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  proposedPrice: { type: Number },
}, { _id: false })

const proposalSchema = new mongoose.Schema({
  serviceRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
  cleanerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cleaner', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'countered', 'withdrawn'],
    default: 'pending',
  },
  proposedDate: { type: Date, required: true },
  proposedHourStart: { type: Number, required: true },
  proposedHourEnd: { type: Number, required: true },
  estimatedPrice: { type: Number },
  taskModifications: [taskModificationSchema],
  counterProposal: {
    preferredDays: [{ type: String }],
    preferredHourStart: { type: Number },
    preferredHourEnd: { type: Number },
  },
}, { timestamps: true })

export const Proposal = mongoose.model('Proposal', proposalSchema)
