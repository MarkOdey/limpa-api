import { Job } from '../models/Job.js'

const DAY = 24 * 60 * 60 * 1000

// How long after a task was last done before it is "due" again.
const FREQUENCY_INTERVAL = {
  daily: 1 * DAY,
  weekly: 7 * DAY,
  monthly: 30 * DAY,
  yearly: 365 * DAY,
  once: Infinity, // a one-time task is never due again once done
}

// For a client's configured tasks, find when each was last completed (across all
// their jobs) and decide whether it is due now.
//
// Returns the configured tasks annotated with { lastDoneAt, due }. A task that
// has never been done is always due.
export async function annotateDueness(clientId, configuredTasks, now = new Date()) {
  const ids = configuredTasks.map((t) => t._id)
  if (!ids.length) return []

  const rows = await Job.aggregate([
    { $match: { clientId } },
    { $unwind: '$todoList' },
    { $match: { 'todoList.status': 'done', 'todoList.configuredTaskId': { $in: ids } } },
    { $group: { _id: '$todoList.configuredTaskId', lastDoneAt: { $max: '$todoList.completedAt' } } },
  ])
  const lastDoneById = new Map(rows.map((r) => [String(r._id), r.lastDoneAt]))

  return configuredTasks.map((t) => {
    const lastDoneAt = lastDoneById.get(String(t._id)) ?? null
    const interval = FREQUENCY_INTERVAL[t.frequency] ?? FREQUENCY_INTERVAL.weekly
    const due = !lastDoneAt || (now - new Date(lastDoneAt).getTime()) >= interval

    const obj = typeof t.toObject === 'function' ? t.toObject() : t
    return { ...obj, lastDoneAt, due }
  })
}
