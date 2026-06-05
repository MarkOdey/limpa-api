import Stripe from 'stripe'
import config from '../config.js'

export const stripe = new Stripe(config.stripe.secretKey)

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
