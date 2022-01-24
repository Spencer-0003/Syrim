/**
 * @file SetBio
 * @description Set your bio
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { CommandInteraction, Message, User } from 'eris';
import type { SyrimClient } from '@core/Client';
import type { Data } from '@typings/command';
import { Constants } from 'eris';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

export class SetBio extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'setbio',
      description: 'Set your bio.',
      category: 'economy',
      options: [
        {
          name: 'bio',
          description: 'Your bio.',
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: true
        }
      ]
    });
  }

  async run(interaction: CommandInteraction, args: Record<string, User | string>, data: Data): Promise<Message> {
    const user = args.user ?? (interaction.member ?? interaction.user)!;
    await this.client.database.updateUser((user as User).id, { bio: args.bio as string });

    return interaction.createFollowup({
      embeds: [
        {
          title: this.client.locale.translate(data.locale, 'global.SUCCESS'),
          description: this.client.locale.translate(data.locale, 'economy.SUCCESSFULLY_SET_BIO'),
          color: COLORS.GREEN
        }
      ]
    });
  }
}
