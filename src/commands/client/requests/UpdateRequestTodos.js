import Boom from '@hapi/boom'

export class UpdateRequestTodos {
  constructor({ uid, requestId, add, remove }) {
    this.uid = uid
    this.requestId = requestId
    this.add = add
    this.remove = remove
  }

  async execute() {
    // TODO: add/remove todo items; enforce job not yet started
    throw Boom.notImplemented()
  }
}
