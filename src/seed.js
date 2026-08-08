// Idempotent demo-data seeding, run on startup when SEED_DEMO=true (implied by
// DEMO_MODE). Safe to run repeatedly: every step checks for existing data first.
//
// It creates two ready-to-use logins that match the mock-auth uid scheme, a
// sample location with configured tasks, and one open service request so the
// cleaner feed and client dashboards have something to show immediately.
import { Task } from './models/Task.js'
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
              { name: 'Living Room', type: 'living' },
              { name: 'Kitchen', type: 'kitchen' },
              { name: 'Bathroom', type: 'bathroom' },
              { name: 'Bedroom', type: 'bedroom' },
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
