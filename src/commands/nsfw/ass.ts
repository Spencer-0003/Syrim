/**
 * @file Ass
 * @description Returns an image of an ass
 * @author Spencer-0003
 */

// Import classes & types
import type { CommandInteraction, Message } from 'eris';
import type { SyrimClient } from '@core/Client';
import type { Data } from '@typings/command';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

// Export class
export class Ass extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'ass',
      description: 'Returns an image of an ass.',
      category: 'nsfw'
    });
  }

  async run(interaction: CommandInteraction, _args: Record<string, string>, data: Data): Promise<Message> {
    return interaction.createFollowup({
      embed: {
        color: COLORS.GREEN,
        image: { url: await this.client.nekoBot.get('ass') },
        footer: { icon_url: 'https://nekobot.xyz/favicon.ico', text: this.client.locale.translate(data.locale, 'misc.POWERED_BY_NEKOBOT') }
      }
    });
  }
}
