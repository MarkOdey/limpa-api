import mongoose from 'mongoose'
import config from '../config.js'

export const mongoPlugin = {
  name: 'mongodb',
  register: async (_server) => {
    await mongoose.connect(config.mongoUri)
    console.log('MongoDB connected')
  },
}
