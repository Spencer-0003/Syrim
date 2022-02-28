/**
 * @file Divorce
 * @description Divorce your spouse
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { SyrimClient } from '@core/Client';
import type { CommandContext } from '@typings/command';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

export class Divorce extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'divorce',
      description: 'Divorce your spouse.',
      category: 'economy',
      guildOnly: true
    });
  }

  async run({ interaction, data }: CommandContext): Promise<void> {
    const userData = await this.client.database.getUser(interaction.member!.id);

    if (userData.lover) await this.client.database.updateUser(interaction.member!.id, { lover: null });
    return interaction.createMessage({
      embed: {
        title: this.client.locale.translate(data.locale, userData.lover ? 'economy.marriage.DIVORCE' : 'global.ERROR'),
        description: this.client.locale.translate(data.locale, userData.lover ? 'economy.marriage.SUCCESSFULLY_DIVORCED' : 'economy.marriage.NOT_MARRIED').replace('SPOUSE', userData.lover as string),
        color: userData.lover ? COLORS.GREEN : COLORS.RED
      }
    });
  }
}
