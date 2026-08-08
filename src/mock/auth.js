// Mock authentication helpers used when AUTH_MODE=mock (demo deployments).
//
// In this mode the API does NOT talk to Firebase at all. The web client sends a
// self-describing bearer token of the form:
//
//     mock.<base64url(JSON.stringify({ uid, email }))>
//
// and we simply decode the uid from it. A bare token (no "mock." prefix) is
// treated as the uid directly, which keeps manual curl testing trivial.
//
// The uid for a given email is deterministic (mockUidFromEmail) so that seeded
// demo accounts resolve to the same uid the browser generates on login.

const PREFIX = 'mock.'

/** Deterministic, human-readable uid derived from an email address. */
export function mockUidFromEmail(email) {
  return 'mock-' + String(email).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

/** Decode a mock bearer token into a uid, or null if it can't be parsed. */
export function decodeMockToken(token) {
  if (!token) return null
  if (!token.startsWith(PREFIX)) return token // bare uid (curl-friendly)
  try {
    const json = Buffer.from(token.slice(PREFIX.length), 'base64url').toString('utf8')
    const { uid } = JSON.parse(json)
    return uid || null
  } catch {
    return null
  }
}
