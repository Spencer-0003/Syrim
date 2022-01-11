/**
 * @file HAss
 * @description Returns an image of an ass
 * @author Spencer-0003
 */

// Import classes & types
import type { CommandInteraction, Message } from 'eris';
import type { SyrimClient } from '@core/Client';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

// Export class
export class HAss extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'hass',
      description: 'Returns an image of an ass (Hentai).',
      category: 'nsfw'
    });
  }

  async run(interaction: CommandInteraction): Promise<Message> {
    return interaction.createFollowup({
      embeds: [
        {
          color: COLORS.GREEN,
          image: { url: await this.client.nekoBot.get('hass') }
        }
      ]
    });
  }
}
