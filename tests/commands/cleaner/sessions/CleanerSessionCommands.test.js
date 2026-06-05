import { describe, it, expect, vi } from 'vitest'

const mockCleaner = { _id: 'cleaner-id-1', firebaseUid: 'cleaner-uid' }

const mockSession = {
  _id: 'session-id-1',
  cleanerId: mockCleaner._id,
  status: 'scheduled',
  scheduledDate: new Date('2024-06-01'),
  hourStart: 9,
  hourEnd: 12,
  todoList: [
    { _id: 'todo-1', name: 'Clean Toilet', status: undefined, id: vi.fn().mockReturnThis() },
    { _id: 'todo-2', name: 'Mop Floor', status: undefined, id: vi.fn().mockReturnThis() },
  ],
}

vi.mock('../../../../src/commands/_helpers/getCleaner.js', () => ({
  getCleaner: vi.fn().mockResolvedValue(mockCleaner),
}))

vi.mock('../../../../src/models/Session.js', () => ({
  Session: {
    find: vi.fn().mockReturnValue({ sort: vi.fn().mockResolvedValue([mockSession]) }),
    findOne: vi.fn().mockResolvedValue(mockSession),
    findOneAndUpdate: vi.fn().mockResolvedValue({ ...mockSession, status: 'in_progress', startedAt: new Date() }),
    findByIdAndUpdate: vi.fn().mockResolvedValue({ ...mockSession, status: 'completed', billedAmount: 0, platformFee: 0, completedAt: new Date() }),
  },
}))

vi.mock('../../../../src/services/stripe.js', () => ({
  calcBilling: vi.fn().mockReturnValue({ billedAmount: 50, platformFee: 0.25, cleanerPayout: 49.75 }),
  createPaymentIntent: vi.fn(),
  stripe: {},
}))

const { GetCleanerSessions } = await import('../../../../src/commands/cleaner/sessions/GetCleanerSessions.js')
const { GetCleanerSession } = await import('../../../../src/commands/cleaner/sessions/GetCleanerSession.js')
const { StartSession } = await import('../../../../src/commands/cleaner/sessions/StartSession.js')
const { CompleteSession } = await import('../../../../src/commands/cleaner/sessions/CompleteSession.js')

describe('GetCleanerSessions', () => {
  it('returns all sessions for the cleaner', async () => {
    const result = await new GetCleanerSessions({ uid: 'cleaner-uid' }).execute()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0]._id).toBe('session-id-1')
  })
})

describe('GetCleanerSession', () => {
  it('returns the session', async () => {
    const result = await new GetCleanerSession({ uid: 'cleaner-uid', sessionId: 'session-id-1' }).execute()
    expect(result.status).toBe('scheduled')
  })

  it('throws 404 when not found', async () => {
    const { Session } = await import('../../../../src/models/Session.js')
    vi.mocked(Session.findOne).mockResolvedValueOnce(null)

    await expect(
      new GetCleanerSession({ uid: 'cleaner-uid', sessionId: 'ghost' }).execute()
    ).rejects.toMatchObject({ output: { statusCode: 404 } })
  })
})

describe('StartSession', () => {
  it('sets status to in_progress', async () => {
    const result = await new StartSession({ uid: 'cleaner-uid', sessionId: 'session-id-1' }).execute()
    expect(result.status).toBe('in_progress')
  })

  it('throws 404 when session not found or not schedulable', async () => {
    const { Session } = await import('../../../../src/models/Session.js')
    vi.mocked(Session.findOneAndUpdate).mockResolvedValueOnce(null)

    await expect(
      new StartSession({ uid: 'cleaner-uid', sessionId: 'ghost' }).execute()
    ).rejects.toMatchObject({ output: { statusCode: 404 } })
  })
})

describe('CompleteSession', () => {
  it('completes the session and returns billing summary', async () => {
    const { Session } = await import('../../../../src/models/Session.js')
    vi.mocked(Session.findOne).mockResolvedValueOnce({ ...mockSession, status: 'in_progress', todoList: [] })

    const result = await new CompleteSession({ uid: 'cleaner-uid', sessionId: 'session-id-1' }).execute()
    expect(result.status).toBe('completed')
    expect(typeof result.billedAmount).toBe('number')
  })

  it('throws 404 when session not in progress', async () => {
    const { Session } = await import('../../../../src/models/Session.js')
    vi.mocked(Session.findOne).mockResolvedValueOnce(null)

    await expect(
      new CompleteSession({ uid: 'cleaner-uid', sessionId: 'ghost' }).execute()
    ).rejects.toMatchObject({ output: { statusCode: 404 } })
  })
})
