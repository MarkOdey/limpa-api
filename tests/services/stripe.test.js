import { describe, it, expect, vi } from 'vitest'

// Mock dotenv and the Stripe constructor before importing the service
vi.mock('dotenv/config', () => ({}))
vi.mock('stripe', () => ({
  default: vi.fn().mockImplementation(() => ({
    paymentIntents: {
      create: vi.fn().mockResolvedValue({ id: 'pi_test_123', status: 'requires_payment_method' }),
    },
  })),
}))

// Import after mocks are set up
const { calcBilling, createPaymentIntent } = await import('../../src/services/stripe.js')

describe('calcBilling', () => {
  it('computes billed amount, platform fee, and cleaner payout', () => {
    const doneTasks = [{ price: 20 }, { price: 30 }]
    const result = calcBilling(doneTasks)

    expect(result.billedAmount).toBe(50)
    expect(result.platformFee).toBe(0.25) // 0.5% of 50
    expect(result.cleanerPayout).toBe(49.75)
  })

  it('returns zeros for an empty task list', () => {
    const result = calcBilling([])

    expect(result.billedAmount).toBe(0)
    expect(result.platformFee).toBe(0)
    expect(result.cleanerPayout).toBe(0)
  })

  it('rounds platform fee to two decimal places', () => {
    const doneTasks = [{ price: 33.33 }]
    const result = calcBilling(doneTasks)

    expect(result.platformFee).toBe(parseFloat((33.33 * 0.005).toFixed(2)))
    expect(result.cleanerPayout).toBe(parseFloat((33.33 - result.platformFee).toFixed(2)))
  })
})

describe('createPaymentIntent', () => {
  it('calls Stripe with amount in cents and correct transfer destination', async () => {
    const Stripe = (await import('stripe')).default
    const mockCreate = vi.mocked(new Stripe()).paymentIntents.create

    const result = await createPaymentIntent({
      amount: 49.75,
      cleanerStripeAccountId: 'acct_test_123',
    })

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 4975,
        currency: 'cad',
        transfer_data: { destination: 'acct_test_123' },
      })
    )
    expect(result.id).toBe('pi_test_123')
  })
})
