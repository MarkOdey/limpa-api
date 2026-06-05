import { describe, it, expect, vi } from 'vitest'

const mockClient = {
  _id: 'client-id-1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
}

const selectMock = vi.fn().mockResolvedValue(mockClient)

vi.mock('../../../../src/models/Client.js', () => ({
  Client: {
    findOne: vi.fn().mockReturnValue({ select: selectMock }),
    findOneAndUpdate: vi.fn().mockReturnValue({ select: selectMock }),
  },
}))

const { GetClientProfile } = await import('../../../../src/commands/client/profile/GetClientProfile.js')
const { UpdateClientProfile } = await import('../../../../src/commands/client/profile/UpdateClientProfile.js')

describe('GetClientProfile', () => {
  it('returns the client profile', async () => {
    const result = await new GetClientProfile({ uid: 'test-uid' }).execute()
    expect(result.email).toBe('test@example.com')
    expect(result.firstName).toBe('John')
  })

  it('throws 404 when client not found', async () => {
    const { Client } = await import('../../../../src/models/Client.js')
    vi.mocked(Client.findOne).mockReturnValueOnce({ select: vi.fn().mockResolvedValue(null) })

    await expect(
      new GetClientProfile({ uid: 'ghost' }).execute()
    ).rejects.toMatchObject({ output: { statusCode: 404 } })
  })
})

describe('UpdateClientProfile', () => {
  it('returns the updated profile', async () => {
    const result = await new UpdateClientProfile({ uid: 'test-uid', data: { firstName: 'Jane' } }).execute()
    expect(result.email).toBe('test@example.com')
  })

  it('throws 404 when client not found', async () => {
    const { Client } = await import('../../../../src/models/Client.js')
    vi.mocked(Client.findOneAndUpdate).mockReturnValueOnce({ select: vi.fn().mockResolvedValue(null) })

    await expect(
      new UpdateClientProfile({ uid: 'ghost', data: {} }).execute()
    ).rejects.toMatchObject({ output: { statusCode: 404 } })
  })
})
