import Boom from '@hapi/boom'
import { Client } from '../../models/Client.js'
import { Cleaner } from '../../models/Cleaner.js'

export class RegisterUser {
  constructor({ role, firebaseUid, email, firstName, lastName, phone }) {
    this.role = role
    this.firebaseUid = firebaseUid
    this.email = email
    this.firstName = firstName
    this.lastName = lastName
    this.phone = phone
  }

  async execute() {
    const { role, firebaseUid, email, firstName, lastName, phone } = this

    if (role === 'client') {
      const existing = await Client.findOne({ firebaseUid })
      if (existing) throw Boom.conflict('Client already registered')
      const client = await Client.create({ firebaseUid, email, firstName, lastName, phone })
      return { _id: client._id, firebaseUid, email, firstName, lastName, createdAt: client.createdAt }
    }

    if (role === 'cleaner') {
      const existing = await Cleaner.findOne({ firebaseUid })
      if (existing) throw Boom.conflict('Cleaner already registered')
      const cleaner = await Cleaner.create({ firebaseUid, email, firstName, lastName, phone })
      return { _id: cleaner._id, firebaseUid, email, firstName, lastName, createdAt: cleaner.createdAt }
    }

    throw Boom.badRequest('Invalid role')
  }
}
