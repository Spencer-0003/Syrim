/**
 * @file Ass
 * @description Returns an image of an ass
 * @author Spencer-0003
 */

// Import classes & types
import type { SyrimClient } from '@core/Client';
import type { CommandContext } from '@typings/command';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

// Export class
export class Ass extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'ass',
      name_localizations: {
        'es-ES': 'culo'
      },
      description: 'Returns an image of an ass.',
      description_localizations: {
        'es-ES': 'Devuelve la imagen de un culo..'
      },
      category: 'nsfw'
    });
  }

  async run({ interaction, data }: CommandContext): Promise<void> {
    return interaction.createMessage({
      embed: {
        color: COLORS.GREEN,
        image: { url: await this.client.nekoBot.get('ass') },
        footer: { icon_url: 'https://nekobot.xyz/favicon.ico', text: this.client.locale.translate(data.locale, 'misc.POWERED_BY_NEKOBOT') }
      }
    });
  }
}
