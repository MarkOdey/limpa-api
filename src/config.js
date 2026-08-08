import 'dotenv/config'

// DEMO_MODE is a single switch that turns on the self-contained demo profile:
// mock auth (no Firebase), mocked Stripe (no keys), and demo data seeding.
// The individual toggles can still be set explicitly to override.
const demoMode = process.env.DEMO_MODE === 'true'

export default {
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/limpa',
  demoMode,
  seedDemo: process.env.SEED_DEMO === 'true' || demoMode,
  // 'mock'     -> decode a self-describing token, no Firebase (demo)
  // 'emulator' -> Firebase Admin against the local Auth emulator
  // 'firebase' -> real Firebase credentials
  authMode:
    process.env.AUTH_MODE ||
    (demoMode ? 'mock' : process.env.FIREBASE_AUTH_EMULATOR_HOST ? 'emulator' : 'firebase'),
  // 'mock' -> no Stripe SDK calls; 'live' -> real Stripe client
  stripeMode: process.env.STRIPE_MODE || (demoMode ? 'mock' : 'live'),
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    platformFeeRate: parseFloat(process.env.PLATFORM_FEE_RATE ?? '0.005'),
  },
}
