/**
 * @file HBoobs
 * @description Returns an image of boobs
 * @author Spencer-0003
 */

// Import classes & types
import type { SyrimClient } from '@core/Client';
import { COLORS } from '@utilities/Constants';
import type { CommandContext } from '@typings/command';
import { Command } from '@core/Command';

// Export class
export class HBoobs extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'hboobs',
      name_localizations: {
        'es-ES': 'htetas'
      },
      description: 'Returns an image of boobs (Hentai).',
      description_localizations: {
        'es-ES': 'Devuelve una imagen de tetas (Hentai).'
      },
      category: 'nsfw'
    });
  }

  async run({ interaction, data }: CommandContext): Promise<void> {
    return interaction.createMessage({
      embed: {
        color: COLORS.GREEN,
        image: { url: await this.client.nekoBot.get('hboobs') },
        footer: { icon_url: 'https://nekobot.xyz/favicon.ico', text: this.client.locale.translate(data.locale, 'misc.POWERED_BY_NEKOBOT') }
      }
    });
  }
}
