/**
 * @file ShardReady
 * @description Log shard information
 * @author Spencer-0003
 */

// Import event
import { Event } from '@core/Event';

// Export class
export class Ready extends Event {
  run(id: number): void {
    console.log(`[Syrim]: Shard ${id} logged in.`);
  }
}
