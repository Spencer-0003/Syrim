/**
 * @file ShardReady
 * @description Log shard information
 * @author Spencer-0003
 */

// Import event
import { Event } from '@core/Event';

// Export class
export class ShardReady extends Event {
  run(id: number): void {
    console.log(`[${this.client.user.username}]: Shard ${id} logged in.`);
  }
}
