import { describe, it, expect, vi } from 'vitest'

const mockRequest = {
  _id: 'req-id-1',
  clientId: 'client-id-1',
  locationId: 'loc-id-1',
  status: 'open',
  isRecurring: false,
  todoList: [{ _id: 'todo-1', name: 'Clean Toilet', frequency: 'weekly', status: 'pending' }],
  broadcastedAt: new Date('2024-01-01'),
}

vi.mock('../../../../src/commands/_helpers/getClientId.js', () => ({
  getClientId: vi.fn().mockResolvedValue('client-id-1'),
}))

vi.mock('../../../../src/models/ConfiguredTask.js', () => ({
  ConfiguredTask: {
    find: vi.fn().mockResolvedValue([
      { _id: 'ct-1', name: 'Clean Toilet', frequency: 'weekly' },
    ]),
  },
}))

vi.mock('../../../../src/models/ServiceRequest.js', () => ({
  ServiceRequest: {
    create: vi.fn().mockResolvedValue(mockRequest),
    find: vi.fn().mockReturnValue({ sort: vi.fn().mockResolvedValue([mockRequest]) }),
    findOne: vi.fn().mockResolvedValue(mockRequest),
    findOneAndUpdate: vi.fn().mockResolvedValue({ ...mockRequest, status: 'cancelled' }),
  },
}))

const { CreateServiceRequest } = await import('../../../../src/commands/client/requests/CreateServiceRequest.js')
const { GetServiceRequests } = await import('../../../../src/commands/client/requests/GetServiceRequests.js')
const { GetServiceRequest } = await import('../../../../src/commands/client/requests/GetServiceRequest.js')
const { CancelRequest } = await import('../../../../src/commands/client/requests/CancelRequest.js')

describe('CreateServiceRequest', () => {
  it('builds a todo list from configured tasks and creates the request', async () => {
    const result = await new CreateServiceRequest({
      uid: 'test-uid', locationId: 'loc-id-1',
      preferredDays: ['Monday'], preferredHourStart: 9, preferredHourEnd: 12,
      isRecurring: false,
    }).execute()

    expect(result._id).toBe('req-id-1')
    expect(result.todoList).toHaveLength(1)
  })
})

describe('GetServiceRequests', () => {
  it('returns all requests for the client', async () => {
    const result = await new GetServiceRequests({ uid: 'test-uid' }).execute()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0]._id).toBe('req-id-1')
  })
})

describe('GetServiceRequest', () => {
  it('returns the request', async () => {
    const result = await new GetServiceRequest({ uid: 'test-uid', requestId: 'req-id-1' }).execute()
    expect(result.status).toBe('open')
  })

  it('throws 404 when not found', async () => {
    const { ServiceRequest } = await import('../../../../src/models/ServiceRequest.js')
    vi.mocked(ServiceRequest.findOne).mockResolvedValueOnce(null)

    await expect(
      new GetServiceRequest({ uid: 'test-uid', requestId: 'ghost' }).execute()
    ).rejects.toMatchObject({ output: { statusCode: 404 } })
  })
})

describe('CancelRequest', () => {
  it('cancels an open request', async () => {
    const result = await new CancelRequest({ uid: 'test-uid', requestId: 'req-id-1' }).execute()
    expect(result.status).toBe('cancelled')
  })

  it('throws 404 when not found or not open', async () => {
    const { ServiceRequest } = await import('../../../../src/models/ServiceRequest.js')
    vi.mocked(ServiceRequest.findOneAndUpdate).mockResolvedValueOnce(null)

    await expect(
      new CancelRequest({ uid: 'test-uid', requestId: 'ghost' }).execute()
    ).rejects.toMatchObject({ output: { statusCode: 404 } })
  })
})
