import admin from 'firebase-admin'

export async function sendNotification({ tokens, title, body, type, referenceId, referenceCollection }) {
  if (!tokens?.length) return

  const messages = tokens.map((token) => ({
    token,
    notification: { title, body },
    data: { type, referenceId, referenceCollection },
  }))

  return admin.messaging().sendEach(messages)
}
