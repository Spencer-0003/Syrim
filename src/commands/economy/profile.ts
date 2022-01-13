/**
 * @file Profile
 * @description View your profile
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { CommandInteraction, User } from 'eris';
import type { SyrimClient } from '@core/Client';
import type { Data } from '@typings/command';
import { Constants } from 'eris';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

export class Profile extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'profile',
      description: 'View your economy profile.',
      category: 'economy',
      options: [
        {
          name: 'user',
          description: 'User to view profile of.',
          type: Constants.ApplicationCommandOptionTypes.USER
        }
      ]
    });
  }

  async run(interaction: CommandInteraction, args: Record<string, User>, data: Data) {
    const user = args.user ?? (interaction.member ?? interaction.user)!;

    if (user.bot)
      return interaction.createFollowup({
        embeds: [
          {
            title: this.client.locale.translate(data.locale, 'global.ERROR'),
            description: this.client.locale.translate(data.locale, 'economy.BOTS_NOT_ALLOWED'),
            color: COLORS.RED
          }
        ]
      });

    const profile = await this.client.database.getUser(user.id);
    return interaction.createFollowup({
      embeds: [
        {
          title: user.username,
          description: profile.bio,
          color: COLORS[profile.color],
          thumbnail: { url: user.avatarURL },
          fields: [
            { name: '💖 ' + this.client.locale.translate(data.locale, 'economy.LOVER'), value: profile.lover ? `<@${profile.lover}>` : this.client.locale.translate(data.locale, 'economy.SINGLE'), inline: true },
            { name: '⚧ ' + this.client.locale.translate(data.locale, 'economy.GENDER'), value: profile.gender, inline: true }
          ]
        }
      ],
      components:
        user.id === (interaction.user ?? interaction.member)!.id
          ? [
              {
                type: Constants.ComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: Constants.ComponentTypes.BUTTON,
                    style: 1,
                    custom_id: `set_gender.${user.id}`,
                    label: this.client.locale.translate(data.locale, `economy.SET_GENDER`)
                  },
                  {
                    type: Constants.ComponentTypes.BUTTON,
                    style: 1,
                    custom_id: `set_color.${user.id}`,
                    label: this.client.locale.translate(data.locale, `economy.SET_COLOR`)
                  },
                  {
                    type: Constants.ComponentTypes.BUTTON,
                    style: 4,
                    custom_id: `delete_profile.${user.id}`,
                    label: this.client.locale.translate(data.locale, `economy.DELETE_PROFILE`)
                  }
                ]
              }
            ]
          : []
    });
  }
}
