/**
 * @file HBoobs
 * @description Returns an image of boobs
 * @author Spencer-0003
 */

// Import classes & types
import type { CommandInteraction, Message } from 'eris';
import type { SyrimClient } from '@core/Client';
import { COLORS } from '@utilities/Constants';
import type { Data } from '@typings/command';
import { Command } from '@core/Command';

// Export class
export class HBoobs extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'hboobs',
      description: 'Returns an image of boobs (Hentai).',
      category: 'nsfw'
    });
  }

  async run(interaction: CommandInteraction, _args: Record<string, string>, data: Data): Promise<Message> {
    return interaction.createFollowup({
      embeds: [
        {
          color: COLORS.GREEN,
          image: { url: await this.client.nekoBot.get('hboobs') },
          footer: { icon_url: 'https://nekobot.xyz/favicon.ico', text: this.client.locale.translate(data.locale, 'misc.POWERED_BY_NEKOBOT') }
        }
      ]
    });
  }
}
