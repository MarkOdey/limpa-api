import { describe, it, expect } from 'vitest'
import { mockUidFromEmail, decodeMockToken } from '../../src/mock/auth.js'

// Mirrors the browser-side token encoder in limpa-web/src/lib/mockAuth.js so the
// two stay in sync: 'mock.' + base64url(JSON.stringify({ uid, email })).
function encodeMockToken(email) {
  const uid = mockUidFromEmail(email)
  const json = JSON.stringify({ uid, email })
  return 'mock.' + Buffer.from(json, 'utf8').toString('base64url')
}

describe('mockUidFromEmail', () => {
  it('is deterministic and normalizes case/spacing', () => {
    expect(mockUidFromEmail('Demo.Client@Limpa.app')).toBe('mock-demo-client-limpa-app')
    expect(mockUidFromEmail('  demo.client@limpa.app ')).toBe('mock-demo-client-limpa-app')
  })

  it('matches the seed demo account uids', () => {
    expect(mockUidFromEmail('demo.cleaner@limpa.app')).toBe('mock-demo-cleaner-limpa-app')
  })
})

describe('decodeMockToken', () => {
  it('round-trips a browser-encoded token back to the uid', () => {
    const token = encodeMockToken('demo.client@limpa.app')
    expect(decodeMockToken(token)).toBe('mock-demo-client-limpa-app')
  })

  it('accepts a bare uid (curl-friendly)', () => {
    expect(decodeMockToken('mock-demo-cleaner-limpa-app')).toBe('mock-demo-cleaner-limpa-app')
  })

  it('returns null for empty/garbage mock tokens', () => {
    expect(decodeMockToken('')).toBeNull()
    expect(decodeMockToken('mock.!!!not-base64-json!!!')).toBeNull()
  })
})
