/**
 * @file Marry
 * @description Marry a person
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { CommandInteraction, Message, User } from 'eris';
import type { SyrimClient } from '@core/Client';
import type { Data } from '@typings/command';
import { Constants } from 'eris';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

export class Marry extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'marry',
      description: 'View your economy profile.',
      category: 'economy',
      guildOnly: true,
      options: [
        {
          name: 'user',
          description: 'User to propose to.',
          type: Constants.ApplicationCommandOptionTypes.USER,
          required: true
        }
      ]
    });
  }

  async run(interaction: CommandInteraction, args: Record<string, User>, data: Data): Promise<Message> {
    const userData = await this.client.database.getUser(interaction.member!.id);
    const spouseData = await this.client.database.getUserIfExists(args.user.id);

    if (!spouseData)
      return interaction.createFollowup({
        embeds: [
          {
            title: this.client.locale.translate(data.locale, 'global.ERROR'),
            description: this.client.locale.translate(data.locale, 'economy.PROFILE_DOESNT_EXIST'),
            color: COLORS.RED
          }
        ]
      });

    if (userData.lover || spouseData.lover)
      return interaction.createFollowup({
        embeds: [
          {
            title: this.client.locale.translate(data.locale, userData.lover ? 'economy.YOURE_ALREADY_MARRIED' : 'economy.SPOUSE_ALREADY_MARRIED'),
            color: COLORS.RED
          }
        ]
      });

    const pendingUserProposal = await this.client.redis.get(`marriage_request:${interaction.member!.id}`) as string;
    const pendingSpouseProposal = await this.client.redis.get(`marriage_request:${args.user.id}`) as string;
    if (pendingUserProposal || pendingSpouseProposal)
      return interaction.createFollowup({
        embeds: [
          {
            title: this.client.locale.translate(data.locale, 'global.ERROR'),
            description: this.client.locale.translate(data.locale, `economy.${pendingUserProposal ? 'USER' : 'SPOUSE'}_ALREADY_REQUESTED`).replace('SPOUSE', pendingSpouseProposal).replace('SENDER', pendingUserProposal),
            color: COLORS.RED
          }
        ]
      });

    await this.client.redis.set(`marriage_request:${args.user.id}`, interaction.member!.id, 'EX', 120);
    return interaction.createFollowup({
      content: `<@${args.user.id}>`,
      embeds: [
        {
          title: this.client.locale.translate(data.locale, 'economy.MARRIAGE'),
          description: this.client.locale.translate(data.locale, 'economy.NEW_PROPOSAL').replace('USER', `<@${args.user.id}>`).replace('PROPOSER', `<@${interaction.member!.id}>`),
          color: COLORS.GREEN
        }
      ],
      components: [
        {
          type: Constants.ComponentTypes.ACTION_ROW,
          components: [
            {
              type: Constants.ComponentTypes.BUTTON,
              style: Constants.ButtonStyles.PRIMARY,
              custom_id: `marry.${args.user.id}`,
              label: this.client.locale.translate(data.locale, `economy.ACCEPT_PROPOSAL`)
            }
          ]
        }
      ]
    });
  }
}
