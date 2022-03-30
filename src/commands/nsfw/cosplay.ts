/**
 * @file Cosplay
 * @description Returns an image of an NSFW cosplay
 * @author Spencer-0003
 */

// Import classes & types
import type { SyrimClient } from '@core/Client';
import type { CommandContext } from '@typings/command';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

// Export class
export class Cosplay extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'cosplay',
      name_localizations: {
        'es-ES': 'tetas'
      },
      description: 'Returns an image of an NSFW cosplay.',
      description_localizations: {
        'es-ES': 'Devuelve una imagen de un cosplay NSFW.'
      },
      category: 'nsfw'
    });
  }

  validate({ data }: CommandContext): [boolean, string] {
    return [process.env.NEKOBOT_API_KEY !== undefined, this.client.locale.translate(data.locale, 'misc.REQUIRES_NEKOBOT_KEY')];
  }

  async run({ interaction, data }: CommandContext): Promise<void> {
    return interaction.createMessage({
      embed: {
        color: COLORS.GREEN,
        image: { url: await this.client.nekoBot.get('cosplay') },
        footer: { icon_url: 'https://nekobot.xyz/favicon.ico', text: this.client.locale.translate(data.locale, 'misc.POWERED_BY_NEKOBOT') }
      }
    });
  }
}
