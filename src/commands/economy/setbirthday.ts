/**
 * @file SetBirthday
 * @description Set your birthday
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { CommandInteraction, User } from 'eris';
import type { SyrimClient } from '@core/Client';
import type { Data } from '@typings/command';
import { Constants } from 'eris';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

export class SetBirthday extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'setbirthday',
      description: 'Set your birthday.',
      category: 'economy',
      options: [
        {
          name: 'birthday',
          description: 'Your birthday (dd/mm/yyyy).',
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: true
        }
      ]
    });
  }

  async run(interaction: CommandInteraction, args: Record<string, User | string>, data: Data) {
    const user = args.user ?? (interaction.member ?? interaction.user)!;
    const sanitizedBirthday = (args.birthday as string).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1').substring(0, 10);

    if (sanitizedBirthday.length < 10 || sanitizedBirthday.indexOf('*') > -1)
      return interaction.createFollowup({
        embeds: [
          {
            title: this.client.locale.translate(data.locale, 'global.ERROR'),
            description: this.client.locale.translate(data.locale, 'economy.INVALID_BIRTHDAY'),
            color: COLORS.RED
          }
        ]
      });

    await this.client.database.updateUser((user as User).id, { birthday: new Date(sanitizedBirthday) });
    return interaction.createFollowup({
      embeds: [
        {
          title: this.client.locale.translate(data.locale, 'global.SUCCESS'),
          description: this.client.locale.translate(data.locale, 'economy.SUCCESSFULLY_SET_BIRTHDAY'),
          color: COLORS.GREEN
        }
      ]
    });
  }
}
