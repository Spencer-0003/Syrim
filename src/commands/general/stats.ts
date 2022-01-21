/**
 * @file Stats
 * @description Shows Syrim's stats
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { CommandInteraction, Message } from 'eris';
import type { SyrimClient } from '@core/Client';
import type { Data } from '@typings/command';
import { VERSION } from 'eris';
import { arch, platform, release } from 'os';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

const formatHost = (platform: string, release: string, arch: string): string => {
  switch (platform) {
    case 'darwin':
      platform = 'macOS';
      break;
    case 'linux':
      platform = 'Linux';
      break;
    case 'win32':
      platform = 'Windows';
      break;
  }

  return `${platform} ${release} ${arch}`;
};

// Export class
export class Stats extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'stats',
      description: 'Shows my stats.',
      category: 'general'
    });
  }

  run(interaction: CommandInteraction, _args: Record<string, string>, data: Data): Promise<Message> {
    return interaction.createFollowup({
      embeds: [
        {
          title: this.client.locale.translate(data.locale, 'general.STATS'),
          color: COLORS.GREEN,
          fields: [
            { name: this.client.locale.translate(data.locale, 'general.SOFTWARE'), value: `Syrim v${this.client.version}\nEris v${VERSION}`, inline: true },
            { name: this.client.locale.translate(data.locale, 'general.DISCORD'), value: `${this.client.guilds.size.toLocaleString(data.locale)} ${this.client.locale.translate(data.locale, 'general.SERVERS')}\n${this.client.users.size} ${this.client.locale.translate(data.locale, 'general.USERS')}\n${this.client.shards.size} ${this.client.locale.translate(data.locale, 'general.SHARDS')}`, inline: true },
            { name: this.client.locale.translate(data.locale, 'general.HOST'), value: formatHost(platform(), release(), arch()), inline: false }
          ]
        }
      ]
    });
  }
}