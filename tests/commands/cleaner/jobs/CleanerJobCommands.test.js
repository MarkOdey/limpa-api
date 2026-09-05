import { describe, it, expect, vi } from 'vitest'

const mockCleaner = { _id: 'cleaner-id-1', firebaseUid: 'cleaner-uid' }

const mockJob = {
  _id: 'job-id-1',
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

vi.mock('../../../../src/models/Job.js', () => ({
  Job: {
    find: vi.fn().mockReturnValue({ sort: vi.fn().mockResolvedValue([mockJob]) }),
    findOne: vi.fn().mockResolvedValue(mockJob),
    findOneAndUpdate: vi.fn().mockResolvedValue({ ...mockJob, status: 'in_progress', startedAt: new Date() }),
    findByIdAndUpdate: vi.fn().mockResolvedValue({ ...mockJob, status: 'completed', billedAmount: 0, platformFee: 0, completedAt: new Date() }),
  },
}))

vi.mock('../../../../src/services/stripe.js', () => ({
  calcBilling: vi.fn().mockReturnValue({ billedAmount: 50, platformFee: 0.25, cleanerPayout: 49.75 }),
  createPaymentIntent: vi.fn(),
  stripe: {},
}))

const { GetCleanerJobs } = await import('../../../../src/commands/cleaner/jobs/GetCleanerJobs.js')
const { GetCleanerJob } = await import('../../../../src/commands/cleaner/jobs/GetCleanerJob.js')
const { StartJob } = await import('../../../../src/commands/cleaner/jobs/StartJob.js')
const { CompleteJob } = await import('../../../../src/commands/cleaner/jobs/CompleteJob.js')

describe('GetCleanerJobs', () => {
  it('returns all jobs for the cleaner', async () => {
    const result = await new GetCleanerJobs({ uid: 'cleaner-uid' }).execute()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0]._id).toBe('job-id-1')
  })
})

describe('GetCleanerJob', () => {
  it('returns the job', async () => {
    const result = await new GetCleanerJob({ uid: 'cleaner-uid', jobId: 'job-id-1' }).execute()
    expect(result.status).toBe('scheduled')
  })

  it('throws 404 when not found', async () => {
    const { Job } = await import('../../../../src/models/Job.js')
    vi.mocked(Job.findOne).mockResolvedValueOnce(null)

    await expect(
      new GetCleanerJob({ uid: 'cleaner-uid', jobId: 'ghost' }).execute()
    ).rejects.toMatchObject({ output: { statusCode: 404 } })
  })
})

describe('StartJob', () => {
  it('sets status to in_progress', async () => {
    const result = await new StartJob({ uid: 'cleaner-uid', jobId: 'job-id-1' }).execute()
    expect(result.status).toBe('in_progress')
  })

  it('throws 404 when job not found or not schedulable', async () => {
    const { Job } = await import('../../../../src/models/Job.js')
    vi.mocked(Job.findOneAndUpdate).mockResolvedValueOnce(null)

    await expect(
      new StartJob({ uid: 'cleaner-uid', jobId: 'ghost' }).execute()
    ).rejects.toMatchObject({ output: { statusCode: 404 } })
  })
})

describe('CompleteJob', () => {
  it('completes the job and returns billing summary', async () => {
    const { Job } = await import('../../../../src/models/Job.js')
    vi.mocked(Job.findOne).mockResolvedValueOnce({ ...mockJob, status: 'in_progress', todoList: [] })

    const result = await new CompleteJob({ uid: 'cleaner-uid', jobId: 'job-id-1' }).execute()
    expect(result.status).toBe('completed')
    expect(typeof result.billedAmount).toBe('number')
  })

  it('throws 404 when job not in progress', async () => {
    const { Job } = await import('../../../../src/models/Job.js')
    vi.mocked(Job.findOne).mockResolvedValueOnce(null)

    await expect(
      new CompleteJob({ uid: 'cleaner-uid', jobId: 'ghost' }).execute()
    ).rejects.toMatchObject({ output: { statusCode: 404 } })
  })
})
