import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContextStore {
  requestId?: string;
}

@Injectable()
export class RequestContextService {
  private readonly storage = new AsyncLocalStorage<RequestContextStore>();

  run(store: RequestContextStore, callback: () => void) {
    this.storage.run(store, callback);
  }

  getStore() {
    return this.storage.getStore();
  }

  getRequestId() {
    return this.storage.getStore()?.requestId;
  }
}
