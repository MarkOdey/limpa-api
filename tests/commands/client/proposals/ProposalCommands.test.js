import { describe, it, expect, vi } from 'vitest'

const mockProposal = {
  _id: 'prop-id-1',
  serviceRequestId: 'req-id-1',
  cleanerId: { _id: 'cleaner-id-1', firstName: 'Bob', avatarUrl: null, yearsOfExperience: 5, reputationScore: 4.8 },
  status: 'pending',
  proposedDate: new Date('2024-06-01'),
  proposedHourStart: 9,
  proposedHourEnd: 12,
  estimatedPrice: 80,
}

vi.mock('../../../../src/commands/_helpers/getClientId.js', () => ({
  getClientId: vi.fn().mockResolvedValue('client-id-1'),
}))

vi.mock('../../../../src/models/Proposal.js', () => ({
  Proposal: {
    find: vi.fn().mockReturnValue({
      populate: vi.fn().mockResolvedValue([mockProposal]),
    }),
    findOne: vi.fn().mockReturnValue({
      populate: vi.fn().mockResolvedValue(mockProposal),
    }),
    updateOne: vi.fn().mockResolvedValue({ modifiedCount: 1 }),
  },
}))

vi.mock('../../../../src/models/ServiceRequest.js', () => ({
  ServiceRequest: {
    findOneAndUpdate: vi.fn().mockResolvedValue({
      _id: 'req-id-1', clientId: 'client-id-1', status: 'accepted',
      todoList: [{ _id: 'todo-1', name: 'Clean Toilet', status: 'pending' }],
    }),
  },
}))

vi.mock('../../../../src/models/Session.js', () => ({
  Session: {
    create: vi.fn().mockResolvedValue({
      _id: 'session-id-1', scheduledDate: new Date('2024-06-01'),
    }),
  },
}))

const { GetProposals } = await import('../../../../src/commands/client/proposals/GetProposals.js')
const { GetProposal } = await import('../../../../src/commands/client/proposals/GetProposal.js')
const { AcceptProposal } = await import('../../../../src/commands/client/proposals/AcceptProposal.js')

describe('GetProposals', () => {
  it('returns proposals for a request', async () => {
    const result = await new GetProposals({ requestId: 'req-id-1' }).execute()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0]._id).toBe('prop-id-1')
  })
})

describe('GetProposal', () => {
  it('returns the proposal', async () => {
    const result = await new GetProposal({ requestId: 'req-id-1', proposalId: 'prop-id-1' }).execute()
    expect(result._id).toBe('prop-id-1')
  })

  it('throws 404 when not found', async () => {
    const { Proposal } = await import('../../../../src/models/Proposal.js')
    vi.mocked(Proposal.findOne).mockReturnValueOnce({ populate: vi.fn().mockResolvedValue(null) })

    await expect(
      new GetProposal({ requestId: 'req-id-1', proposalId: 'ghost' }).execute()
    ).rejects.toMatchObject({ output: { statusCode: 404 } })
  })
})

describe('AcceptProposal', () => {
  it('accepts proposal, marks request accepted, creates session', async () => {
    const { Proposal } = await import('../../../../src/models/Proposal.js')
    vi.mocked(Proposal.findOne).mockResolvedValueOnce(mockProposal)

    const result = await new AcceptProposal({ uid: 'test-uid', requestId: 'req-id-1', proposalId: 'prop-id-1' }).execute()
    expect(result.sessionId).toBe('session-id-1')
    expect(result.status).toBe('scheduled')
  })
})
