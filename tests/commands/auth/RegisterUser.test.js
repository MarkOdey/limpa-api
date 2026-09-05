import { describe, it, expect, vi } from 'vitest'

vi.mock('../../../src/models/Client.js', () => ({
  Client: {
    findOne: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockImplementation((data) => ({ ...data, _id: 'client-id-1', createdAt: new Date('2024-01-01') })),
  },
}))

vi.mock('../../../src/models/Cleaner.js', () => ({
  Cleaner: {
    findOne: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockImplementation((data) => ({ ...data, _id: 'cleaner-id-1', createdAt: new Date('2024-01-01') })),
  },
}))

vi.mock('../../../src/models/User.js', () => ({
  ROLES: ['client', 'worker', 'admin'],
  User: {
    findOneAndUpdate: vi.fn().mockImplementation((_q, update) => ({
      firebaseUid: update.$setOnInsert.firebaseUid,
      roles: update.$addToSet.roles ? [update.$addToSet.roles] : [],
    })),
  },
}))

const { RegisterUser } = await import('../../../src/commands/auth/RegisterUser.js')

describe('RegisterUser', () => {
  it('creates and returns a new client', async () => {
    const result = await new RegisterUser({
      role: 'client', firebaseUid: 'uid-abc', email: 'client@test.com',
      firstName: 'Jane', lastName: 'Doe', phone: '5141234567',
    }).execute()

    expect(result._id).toBe('client-id-1')
    expect(result.email).toBe('client@test.com')
    expect(result.firstName).toBe('Jane')
    expect(result.roles).toEqual(['client'])
  })

  it('creates and returns a new cleaner', async () => {
    const result = await new RegisterUser({
      role: 'cleaner', firebaseUid: 'uid-xyz', email: 'cleaner@test.com',
      firstName: 'Bob', lastName: 'Smith', phone: '4381234567',
    }).execute()

    expect(result._id).toBe('cleaner-id-1')
    expect(result.email).toBe('cleaner@test.com')
    expect(result.roles).toEqual(['worker'])
  })

  it('throws 400 for an unknown role', async () => {
    await expect(
      new RegisterUser({ role: 'admin', firebaseUid: 'uid-999', email: 'x@x.com', firstName: 'A', lastName: 'B', phone: '' }).execute()
    ).rejects.toMatchObject({ output: { statusCode: 400 } })
  })

  it('throws 409 when client already exists', async () => {
    const { Client } = await import('../../../src/models/Client.js')
    vi.mocked(Client.findOne).mockResolvedValueOnce({ _id: 'existing-id' })

    await expect(
      new RegisterUser({ role: 'client', firebaseUid: 'uid-abc', email: 'client@test.com', firstName: 'Jane', lastName: 'Doe', phone: '' }).execute()
    ).rejects.toMatchObject({ output: { statusCode: 409 } })
  })
})
