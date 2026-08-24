// Idempotent demo-data seeding, run on startup when SEED_DEMO=true (implied by
// DEMO_MODE). Safe to run repeatedly: every step checks for existing data first.
//
// It creates two ready-to-use logins that match the mock-auth uid scheme, a
// sample location with configured tasks, and one open service request so the
// cleaner feed and client dashboards have something to show immediately.
import { Task } from './models/Task.js'
import { Furniture } from './models/Furniture.js'
import { Client } from './models/Client.js'
import { Cleaner } from './models/Cleaner.js'
import { Location } from './models/Location.js'
import { ConfiguredTask } from './models/ConfiguredTask.js'
import { ServiceRequest } from './models/ServiceRequest.js'
import { mockUidFromEmail } from './mock/auth.js'

export const DEMO_CLIENT_EMAIL = 'demo.client@limpa.app'
export const DEMO_CLEANER_EMAIL = 'demo.cleaner@limpa.app'

const TASK_CATALOG = [
  { name: 'Vacuum floors', defaultFrequency: 'weekly', applicableRoomTypes: ['bedroom', 'living', 'office'] },
  { name: 'Mop floors', defaultFrequency: 'weekly', applicableRoomTypes: ['kitchen', 'bathroom'] },
  { name: 'Clean bathroom', defaultFrequency: 'weekly', applicableRoomTypes: ['bathroom'] },
  { name: 'Wipe kitchen surfaces', defaultFrequency: 'weekly', applicableRoomTypes: ['kitchen'] },
  { name: 'Dust surfaces', defaultFrequency: 'weekly', applicableRoomTypes: ['living', 'bedroom', 'office'] },
  { name: 'Change bed linen', defaultFrequency: 'weekly', applicableRoomTypes: ['bedroom'] },
  { name: 'Empty bins', defaultFrequency: 'weekly', applicableRoomTypes: ['kitchen', 'office', 'bathroom'] },
  { name: 'Window cleaning', defaultFrequency: 'monthly', applicableRoomTypes: ['living', 'bedroom'] },
]

async function seedTaskCatalog() {
  for (const t of TASK_CATALOG) {
    await Task.updateOne(
      { name: t.name },
      { $setOnInsert: { ...t, baseRates: [{ region: 'default', price: 25 }], status: 'active' } },
      { upsert: true },
    )
  }
}

// Placeable furniture catalog. `applicableRoomTypes` drives the type-filtered
// browse; the name search endpoint ignores it (search bypasses the filter).
const FURNITURE_CATALOG = [
  { kind: 'toilet', name: 'Toilet', icon: 'mdi-toilet', applicableRoomTypes: ['bathroom'], defaultSize: { width: 40, height: 48 } },
  { kind: 'bathtub', name: 'Bathtub', icon: 'mdi-bathtub', applicableRoomTypes: ['bathroom'], defaultSize: { width: 120, height: 56 } },
  { kind: 'shower', name: 'Shower', icon: 'mdi-shower', applicableRoomTypes: ['bathroom'], defaultSize: { width: 56, height: 56 } },
  { kind: 'sink', name: 'Sink', icon: 'mdi-faucet', applicableRoomTypes: ['bathroom', 'kitchen'], defaultSize: { width: 48, height: 40 } },
  { kind: 'fridge', name: 'Fridge', icon: 'mdi-fridge', applicableRoomTypes: ['kitchen'], defaultSize: { width: 56, height: 56 } },
  { kind: 'stove', name: 'Stove', icon: 'mdi-stove', applicableRoomTypes: ['kitchen'], defaultSize: { width: 56, height: 56 } },
  { kind: 'counter', name: 'Counter', icon: 'mdi-countertop', applicableRoomTypes: ['kitchen'], defaultSize: { width: 120, height: 40 } },
  { kind: 'kitchen-table', name: 'Kitchen Table', icon: 'mdi-table-furniture', applicableRoomTypes: ['kitchen', 'living'], defaultSize: { width: 96, height: 96 } },
  { kind: 'dishwasher', name: 'Dishwasher', icon: 'mdi-dishwasher', applicableRoomTypes: ['kitchen'], defaultSize: { width: 56, height: 56 } },
  { kind: 'bed', name: 'Bed', icon: 'mdi-bed', applicableRoomTypes: ['bedroom'], defaultSize: { width: 120, height: 96 } },
  { kind: 'wardrobe', name: 'Wardrobe', icon: 'mdi-wardrobe', applicableRoomTypes: ['bedroom'], defaultSize: { width: 96, height: 40 } },
  { kind: 'nightstand', name: 'Nightstand', icon: 'mdi-table-furniture', applicableRoomTypes: ['bedroom'], defaultSize: { width: 40, height: 40 } },
  { kind: 'couch', name: 'Couch', icon: 'mdi-sofa', applicableRoomTypes: ['living'], defaultSize: { width: 120, height: 56 } },
  { kind: 'tv-stand', name: 'TV Stand', icon: 'mdi-television', applicableRoomTypes: ['living'], defaultSize: { width: 96, height: 40 } },
  { kind: 'coffee-table', name: 'Coffee Table', icon: 'mdi-table-furniture', applicableRoomTypes: ['living', 'office'], defaultSize: { width: 72, height: 48 } },
  { kind: 'desk', name: 'Desk', icon: 'mdi-desk', applicableRoomTypes: ['office'], defaultSize: { width: 96, height: 48 } },
  { kind: 'office-chair', name: 'Office Chair', icon: 'mdi-chair-rolling', applicableRoomTypes: ['office'], defaultSize: { width: 40, height: 40 } },
  { kind: 'bookshelf', name: 'Bookshelf', icon: 'mdi-bookshelf', applicableRoomTypes: ['office', 'living', 'bedroom'], defaultSize: { width: 72, height: 32 } },
  { kind: 'rug', name: 'Rug / Carpet', icon: 'mdi-rug', applicableRoomTypes: ['living', 'bedroom', 'office'], defaultSize: { width: 160, height: 120 } },
]

async function seedFurnitureCatalog() {
  for (const f of FURNITURE_CATALOG) {
    await Furniture.updateOne(
      { kind: f.kind },
      { $setOnInsert: { ...f, status: 'active' } },
      { upsert: true },
    )
  }
}

async function upsertUser(Model, email, extra = {}) {
  const firebaseUid = mockUidFromEmail(email)
  let doc = await Model.findOne({ firebaseUid })
  if (!doc) {
    doc = await Model.create({ firebaseUid, email, ...extra })
  }
  return doc
}

export async function seedDemo() {
  await seedTaskCatalog()
  await seedFurnitureCatalog()

  const client = await upsertUser(Client, DEMO_CLIENT_EMAIL, {
    firstName: 'Demo',
    lastName: 'Client',
    phone: '+1 555 0100',
  })

  await upsertUser(Cleaner, DEMO_CLEANER_EMAIL, {
    firstName: 'Demo',
    lastName: 'Cleaner',
    phone: '+1 555 0200',
    bio: 'Friendly demo cleaner with a spotless record.',
    yearsOfExperience: 4,
    reputationScore: 4.8,
    completedSessionCount: 37,
    availability: { preferredDays: ['mon', 'wed', 'fri'], preferredHourStart: 9, preferredHourEnd: 17 },
  })

  // One sample location for the demo client.
  let location = await Location.findOne({ clientId: client._id })
  if (!location) {
    location = await Location.create({
      clientId: client._id,
      address: {
        street: '123 Sparkle Street',
        city: 'Montreal',
        province: 'QC',
        country: 'Canada',
        postalCode: 'H2X 1Y4',
      },
      building: {
        levels: [
          {
            name: 'Main floor',
            rooms: [
              { name: 'Living Room', type: 'living', position: { x: 24, y: 24 }, size: { width: 240, height: 168 } },
              { name: 'Kitchen', type: 'kitchen', position: { x: 288, y: 24 }, size: { width: 168, height: 168 } },
              { name: 'Bathroom', type: 'bathroom', position: { x: 24, y: 216 }, size: { width: 120, height: 120 } },
              { name: 'Bedroom', type: 'bedroom', position: { x: 168, y: 216 }, size: { width: 216, height: 120 } },
            ],
          },
        ],
      },
    })
  }

  // A few active configured tasks for that location.
  const existingConfigured = await ConfiguredTask.countDocuments({ locationId: location._id })
  if (existingConfigured === 0) {
    const catalog = await Task.find({ status: 'active' }).limit(4)
    await ConfiguredTask.insertMany(
      catalog.map((t) => ({
        clientId: client._id,
        locationId: location._id,
        taskId: t._id,
        name: t.name,
        status: 'active',
        targetType: 'all',
        frequency: t.defaultFrequency,
      })),
    )
  }

  // One open service request so the cleaner feed is not empty.
  const openReq = await ServiceRequest.findOne({ clientId: client._id, status: 'open' })
  if (!openReq) {
    const configured = await ConfiguredTask.find({ clientId: client._id, locationId: location._id, status: 'active' })
    await ServiceRequest.create({
      clientId: client._id,
      locationId: location._id,
      status: 'open',
      preferredDays: ['mon', 'wed'],
      preferredHourStart: 9,
      preferredHourEnd: 12,
      todoList: configured.map((t) => ({
        configuredTaskId: t._id,
        name: t.name,
        frequency: t.frequency,
        status: 'pending',
      })),
      broadcastedAt: new Date(),
    })
  }

  return { clientEmail: DEMO_CLIENT_EMAIL, cleanerEmail: DEMO_CLEANER_EMAIL }
}
