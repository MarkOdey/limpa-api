import { describe, it, expect, vi } from 'vitest'

const mockCleaner = {
  _id: 'cleaner-id-1',
  firebaseUid: 'cleaner-uid',
  firstName: 'Bob',
  yearsOfExperience: 5,
  reputationScore: 4.8,
  badges: [],
  availability: { preferredDays: ['Monday'], preferredHourStart: 8, preferredHourEnd: 17 },
  taskModifiers: [],
  updatedAt: new Date('2024-01-01'),
}

const chainMock = { populate: vi.fn().mockReturnThis(), select: vi.fn().mockResolvedValue(mockCleaner) }

vi.mock('../../../../src/models/Cleaner.js', () => ({
  Cleaner: {
    findOne: vi.fn().mockReturnValue(chainMock),
    findOneAndUpdate: vi.fn().mockReturnValue(chainMock),
    findById: vi.fn().mockReturnValue(chainMock),
  },
}))

const { GetCleanerProfile } = await import('../../../../src/commands/cleaner/profile/GetCleanerProfile.js')
const { UpdateAvailability } = await import('../../../../src/commands/cleaner/profile/UpdateAvailability.js')
const { UpdateTaskModifiers } = await import('../../../../src/commands/cleaner/profile/UpdateTaskModifiers.js')
const { GetPublicProfile } = await import('../../../../src/commands/cleaner/profile/GetPublicProfile.js')

describe('GetCleanerProfile', () => {
  it('returns the cleaner profile', async () => {
    const result = await new GetCleanerProfile({ uid: 'cleaner-uid' }).execute()
    expect(result.firstName).toBe('Bob')
    expect(result.yearsOfExperience).toBe(5)
  })

  it('throws 404 when not found', async () => {
    const { Cleaner } = await import('../../../../src/models/Cleaner.js')
    vi.mocked(Cleaner.findOne).mockReturnValueOnce({ populate: vi.fn().mockReturnThis(), select: vi.fn().mockResolvedValue(null) })

    await expect(
      new GetCleanerProfile({ uid: 'ghost' }).execute()
    ).rejects.toMatchObject({ output: { statusCode: 404 } })
  })
})

describe('UpdateAvailability', () => {
  it('returns updated availability', async () => {
    const { Cleaner } = await import('../../../../src/models/Cleaner.js')
    vi.mocked(Cleaner.findOneAndUpdate).mockResolvedValueOnce({
      availability: { preferredDays: ['Friday'], preferredHourStart: 10, preferredHourEnd: 16 },
      updatedAt: new Date(),
    })

    const result = await new UpdateAvailability({
      uid: 'cleaner-uid',
      availability: { preferredDays: ['Friday'], preferredHourStart: 10, preferredHourEnd: 16 },
    }).execute()

    expect(result.availability.preferredDays).toEqual(['Friday'])
  })
})

describe('UpdateTaskModifiers', () => {
  it('returns updated task modifiers', async () => {
    const { Cleaner } = await import('../../../../src/models/Cleaner.js')
    vi.mocked(Cleaner.findOneAndUpdate).mockResolvedValueOnce({
      taskModifiers: [{ taskId: 'task-1', modifier: 0.1 }],
      updatedAt: new Date(),
    })

    const result = await new UpdateTaskModifiers({
      uid: 'cleaner-uid',
      taskModifiers: [{ taskId: 'task-1', modifier: 0.1 }],
    }).execute()

    expect(result.taskModifiers).toHaveLength(1)
  })
})

describe('GetPublicProfile', () => {
  it('returns public profile fields', async () => {
    const result = await new GetPublicProfile({ cleanerId: 'cleaner-id-1' }).execute()
    expect(result.firstName).toBe('Bob')
    expect(result.reputationScore).toBe(4.8)
  })
})
