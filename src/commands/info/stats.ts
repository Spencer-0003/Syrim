/**
 * @file Stats
 * @description Shows Syrim's stats
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { Message } from 'eris';
import type { SyrimClient } from '@core/Client';
import type { CommandContext } from '@typings/command';
import { VERSION } from 'eris';
import { arch, platform, release } from 'os';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

const formatHost = (): string => {
  let platformStr = platform() as string;
  switch (platformStr) {
    case 'darwin':
      platformStr = 'macOS';
      break;
    case 'linux':
      platformStr = 'Linux';
      break;
    case 'win32':
      platformStr = 'Windows';
      break;
  }

  return `${platformStr} ${release()} ${arch()}`;
};

// Export class
export class Stats extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'stats',
      description: 'Shows my stats.',
      category: 'info'
    });
  }

  run({ interaction, data }: CommandContext): Promise<Message> {
    return interaction.createFollowup({
      embed: {
        title: this.client.locale.translate(data.locale, 'general.STATS'),
        color: COLORS.GREEN,
        fields: [
          { name: this.client.locale.translate(data.locale, 'general.SOFTWARE'), value: `Syrim v${this.client.version}\nEris v${VERSION}`, inline: true },
          {
            name: this.client.locale.translate(data.locale, 'general.DISCORD'),
            value: `${this.client.guilds.size.toLocaleString(data.locale)} ${this.client.locale.translate(data.locale, 'general.SERVERS')}\n${this.client.users.size} ${this.client.locale.translate(data.locale, 'general.USERS')}\n${this.client.shards.size} ${this.client.locale.translate(data.locale, 'general.SHARDS')}\n${interaction.guildID ? this.client.guilds.get(interaction.guildID)?.shard.latency : this.client.shards.get(0)!.latency}ms ${this.client.locale.translate(data.locale, 'general.PING')}`,
            inline: true
          },
          { name: this.client.locale.translate(data.locale, 'general.HOST'), value: formatHost(), inline: false }
        ]
      }
    });
  }
}
