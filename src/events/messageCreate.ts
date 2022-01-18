/**
 * @file MessageCreate
 * @description Handles new messages
 * @author Spencer-0003
 */

// Import classes & types
import { Message } from 'eris';
import { Event } from '@core/Event';

const xpCooldown = new Set<string>();

// Export event
export class MessageCreate extends Event {
  async run(message: Message): Promise<void> {
    if (!message.guildID || message.author.bot || xpCooldown.has(message.author.id)) return;
    xpCooldown.add(message.author.id);

    const profile = await this.client.database.getUser(message.author.id);
    const xpNeeded = profile.level ** 2 + 25 * profile.level;
    const levelledUp = profile.xp + 1 > xpNeeded;

    setTimeout(() => xpCooldown.delete(message.author.id), 3000);
    await this.client.database.updateUser(message.author.id, { level: profile.level + (levelledUp ? 1 : 0), xp: profile.xp + 1 });
  }
}
