/**
 * @file HAss
 * @description Returns an image of an ass
 * @author Spencer-0003
 */

// Import classes & types
import type { SyrimClient } from '@core/Client';
import type { CommandContext } from '@typings/command';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

// Export class
export class HAss extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'hass',
      name_localizations: {
        'es-ES': 'hculo'
      },
      description: 'Returns an image of an ass (Hentai).',
      description_localizations: {
        'es-ES': 'Devuelve una imagen de un culo (Hentai).'
      },
      category: 'nsfw'
    });
  }

  async run({ interaction, data }: CommandContext): Promise<void> {
    return interaction.createMessage({
      embed: {
        color: COLORS.GREEN,
        image: { url: await this.client.nekoBot.get('hass') },
        footer: { icon_url: 'https://nekobot.xyz/favicon.ico', text: this.client.locale.translate(data.locale, 'misc.POWERED_BY_NEKOBOT') }
      }
    });
  }
}
