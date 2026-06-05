import { describe, it, expect, vi } from 'vitest'

const mockLocation = {
  _id: 'loc-id-1',
  clientId: 'client-id-1',
  address: { street: '123 Main St', city: 'Montreal', province: 'QC', country: 'CA', postalCode: 'H2Y 1C6' },
  building: { levels: [] },
  land: { areas: [] },
  updatedAt: new Date('2024-01-01'),
}

vi.mock('../../../../src/commands/_helpers/getClientId.js', () => ({
  getClientId: vi.fn().mockResolvedValue('client-id-1'),
}))

vi.mock('../../../../src/models/Location.js', () => ({
  Location: {
    find: vi.fn().mockResolvedValue([mockLocation]),
    findOne: vi.fn().mockResolvedValue(mockLocation),
    findOneAndUpdate: vi.fn().mockResolvedValue(mockLocation),
    create: vi.fn().mockResolvedValue(mockLocation),
    deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1 }),
  },
}))

const { GetLocations } = await import('../../../../src/commands/client/locations/GetLocations.js')
const { CreateLocation } = await import('../../../../src/commands/client/locations/CreateLocation.js')
const { GetLocation } = await import('../../../../src/commands/client/locations/GetLocation.js')
const { DeleteLocation } = await import('../../../../src/commands/client/locations/DeleteLocation.js')
const { UpdateBuilding } = await import('../../../../src/commands/client/locations/UpdateBuilding.js')

describe('GetLocations', () => {
  it('returns all locations for the client', async () => {
    const result = await new GetLocations({ uid: 'test-uid' }).execute()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0].address.city).toBe('Montreal')
  })
})

describe('CreateLocation', () => {
  it('creates and returns the new location', async () => {
    const result = await new CreateLocation({ uid: 'test-uid', data: { address: mockLocation.address } }).execute()
    expect(result._id).toBe('loc-id-1')
  })
})

describe('GetLocation', () => {
  it('returns the location', async () => {
    const result = await new GetLocation({ uid: 'test-uid', locationId: 'loc-id-1' }).execute()
    expect(result._id).toBe('loc-id-1')
  })

  it('throws 404 when not found', async () => {
    const { Location } = await import('../../../../src/models/Location.js')
    vi.mocked(Location.findOne).mockResolvedValueOnce(null)

    await expect(
      new GetLocation({ uid: 'test-uid', locationId: 'ghost' }).execute()
    ).rejects.toMatchObject({ output: { statusCode: 404 } })
  })
})

describe('DeleteLocation', () => {
  it('returns success when deleted', async () => {
    const result = await new DeleteLocation({ uid: 'test-uid', locationId: 'loc-id-1' }).execute()
    expect(result.success).toBe(true)
  })

  it('throws 404 when not found', async () => {
    const { Location } = await import('../../../../src/models/Location.js')
    vi.mocked(Location.deleteOne).mockResolvedValueOnce({ deletedCount: 0 })

    await expect(
      new DeleteLocation({ uid: 'test-uid', locationId: 'ghost' }).execute()
    ).rejects.toMatchObject({ output: { statusCode: 404 } })
  })
})

describe('UpdateBuilding', () => {
  it('returns updated building data', async () => {
    const result = await new UpdateBuilding({ uid: 'test-uid', locationId: 'loc-id-1', building: { levels: [] } }).execute()
    expect(result._id).toBe('loc-id-1')
    expect(result).toHaveProperty('building')
  })
})
