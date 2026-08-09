import { describe, it, expect, vi } from 'vitest'

const bathroomItems = [
  { _id: 'f1', kind: 'toilet', name: 'Toilet', applicableRoomTypes: ['bathroom'] },
  { _id: 'f2', kind: 'sink', name: 'Sink', applicableRoomTypes: ['bathroom', 'kitchen'] },
]

// Furniture.find(query) is awaited directly in ListFurniture, and chained with
// .limit(20) in SearchFurniture — so the mock resolves to an array that also has
// a .limit() returning the same array.
function makeQueryResult(items) {
  const arr = [...items]
  arr.limit = vi.fn().mockReturnValue(items)
  return arr
}

vi.mock('../../../../src/models/Furniture.js', () => ({
  Furniture: {
    find: vi.fn((query) => {
      if (query.name) return makeQueryResult(bathroomItems) // search path
      if (query.applicableRoomTypes === 'bathroom') return makeQueryResult(bathroomItems)
      return makeQueryResult([]) // unknown room type
    }),
  },
}))

const { ListFurniture } = await import('../../../../src/commands/client/furniture/ListFurniture.js')
const { SearchFurniture } = await import('../../../../src/commands/client/furniture/SearchFurniture.js')

describe('ListFurniture', () => {
  it('filters the catalog by room type', async () => {
    const { Furniture } = await import('../../../../src/models/Furniture.js')
    const result = await new ListFurniture({ roomType: 'bathroom' }).execute()
    expect(Furniture.find).toHaveBeenCalledWith({ status: 'active', applicableRoomTypes: 'bathroom' })
    expect(result.furniture.map((f) => f.kind)).toContain('toilet')
  })

  it('returns everything active when no room type is given', async () => {
    const { Furniture } = await import('../../../../src/models/Furniture.js')
    await new ListFurniture({ roomType: '' }).execute()
    expect(Furniture.find).toHaveBeenCalledWith({ status: 'active' })
  })
})

describe('SearchFurniture', () => {
  it('searches by name and ignores room type (bypasses the filter)', async () => {
    const { Furniture } = await import('../../../../src/models/Furniture.js')
    const result = await new SearchFurniture({ q: 'sink' }).execute()
    const query = Furniture.find.mock.calls.at(-1)[0]
    expect(query).toMatchObject({ status: 'active' })
    expect(query.name).toBeDefined()
    expect(query.applicableRoomTypes).toBeUndefined()
    expect(result.furniture.length).toBeGreaterThan(0)
  })
})
