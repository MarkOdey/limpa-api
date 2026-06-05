import { Session } from '../../../models/Session.js'
import { getClientId } from '../../_helpers/getClientId.js'

export class GetClientSessions {
  constructor({ uid }) {
    this.uid = uid
  }

  async execute() {
    const clientId = await getClientId(this.uid)
    return Session.find({ clientId }).sort({ scheduledDate: -1 })
  }
}
