import Stripe from 'stripe'
import config from '../config.js'

// In demo mode we never call Stripe. Constructing the real client without a key
// throws at import time, so hand back a lightweight stub whose methods resolve
// to plausible fake objects. Nothing in the app currently calls these at
// runtime, but the stub keeps the surface safe if a caller is added later.
function createStripeStub() {
  const fakeIntent = () => ({
    id: `pi_mock_${Math.random().toString(36).slice(2, 12)}`,
    status: 'succeeded',
    client_secret: `pi_mock_secret_${Math.random().toString(36).slice(2, 12)}`,
  })
  return {
    paymentIntents: { create: async () => fakeIntent() },
    accounts: { create: async () => ({ id: `acct_mock_${Math.random().toString(36).slice(2, 12)}` }) },
    paymentMethods: { attach: async () => ({}), detach: async () => ({}) },
  }
}

export const stripe =
  config.stripeMode === 'mock' ? createStripeStub() : new Stripe(config.stripe.secretKey)

export function calcBilling(doneTasks) {
  const total = doneTasks.reduce((sum, t) => sum + t.price, 0)
  const fee = parseFloat((total * config.stripe.platformFeeRate).toFixed(2))
  return { billedAmount: total, platformFee: fee, cleanerPayout: total - fee }
}

export async function createPaymentIntent({ amount, cleanerStripeAccountId, currency = 'cad' }) {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    application_fee_amount: Math.round(amount * config.stripe.platformFeeRate * 100),
    transfer_data: { destination: cleanerStripeAccountId },
  })
}
