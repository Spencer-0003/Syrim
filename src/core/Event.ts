/**
 * @file Event
 * @description Base class for events
 * @author Spencer-0003
 */

// Import types
import type { SyrimClient } from '@core/Client';

// Export class
export abstract class Event {
  client: SyrimClient;

  protected constructor(client: SyrimClient) {
    this.client = client;
  }

  abstract run(...args: unknown[]): Promise<unknown> | unknown;
}
