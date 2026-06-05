import { describe, it, expect, vi } from 'vitest'

const mockSendEach = vi.fn().mockResolvedValue({ successCount: 2, failureCount: 0 })

vi.mock('firebase-admin', () => ({
  default: {
    messaging: () => ({ sendEach: mockSendEach }),
  },
}))

const { sendNotification } = await import('../../src/services/fcm.js')

describe('sendNotification', () => {
  it('returns undefined and skips sendEach when tokens array is empty', async () => {
    const result = await sendNotification({
      tokens: [],
      title: 'Test',
      body: 'Body',
      type: 'TEST',
      referenceId: '1',
      referenceCollection: 'col',
    })

    expect(result).toBeUndefined()
    expect(mockSendEach).not.toHaveBeenCalled()
  })

  it('returns undefined when tokens is null', async () => {
    const result = await sendNotification({
      tokens: null,
      title: 'Test',
      body: 'Body',
      type: 'TEST',
      referenceId: '1',
      referenceCollection: 'col',
    })

    expect(result).toBeUndefined()
  })

  it('sends one message per token with correct structure', async () => {
    await sendNotification({
      tokens: ['device-token-1', 'device-token-2'],
      title: 'New Proposal',
      body: 'A cleaner responded to your request',
      type: 'PROPOSAL_RECEIVED',
      referenceId: 'req-abc',
      referenceCollection: 'serviceRequests',
    })

    expect(mockSendEach).toHaveBeenCalledOnce()

    const messages = mockSendEach.mock.calls[0][0]
    expect(messages).toHaveLength(2)
    expect(messages[0].token).toBe('device-token-1')
    expect(messages[0].notification).toEqual({
      title: 'New Proposal',
      body: 'A cleaner responded to your request',
    })
    expect(messages[0].data).toEqual({
      type: 'PROPOSAL_RECEIVED',
      referenceId: 'req-abc',
      referenceCollection: 'serviceRequests',
    })
  })

  it('forwards the FCM response', async () => {
    const result = await sendNotification({
      tokens: ['tok'],
      title: 'T',
      body: 'B',
      type: 'SESSION_STARTED',
      referenceId: 'sess-1',
      referenceCollection: 'sessions',
    })

    expect(result).toEqual({ successCount: 2, failureCount: 0 })
  })
})
