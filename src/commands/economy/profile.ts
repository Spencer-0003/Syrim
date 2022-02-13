/**
 * @file Profile
 * @description View your profile
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { Message, User } from 'eris';
import type { SyrimClient } from '@core/Client';
import type { CommandContext } from '@typings/command';
import { Constants } from 'eris';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

const getAge = (birthday: Date): number => {
  const today = new Date();
  const month = today.getMonth() - birthday.getMonth();
  let age = today.getFullYear() - birthday.getFullYear();
  if (month < 0 || (month === 0 && today.getDate() < birthday.getDate())) age--;

  return age;
};

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

  validate({ args, data }: CommandContext): [boolean, string] {
    return [!(args.user as User).bot, this.client.locale.translate(data.locale, 'economy.BOTS_NOT_ALLOWED')];
  }

  async run({ interaction, args, data }: CommandContext): Promise<Message> {
    const user = (args.user as User) ?? (interaction.member ?? interaction.user)!;
    const profile = await this.client.database.getUserIfExists(user.id);

    if (!profile)
      return interaction.createFollowup({
        embed: {
          title: this.client.locale.translate(data.locale, 'global.ERROR'),
          description: this.client.locale.translate(data.locale, 'economy.PROFILE_DOESNT_EXIST'),
          color: COLORS.RED
        }
      });

    const xpNeeded = profile.level ** 2 + 25 * profile.level;
    return interaction.createFollowup({
      embed: {
        title: user.username,
        description: profile.bio,
        color: COLORS[profile.color],
        thumbnail: { url: user.avatarURL },
        fields: [
          { name: '📛 ' + this.client.locale.translate(data.locale, 'economy.REPUTATION'), value: profile.reputation, inline: true },
          { name: '💡 ' + this.client.locale.translate(data.locale, 'economy.GLOBAL_LEVEL'), value: `${profile.level}\n(${profile.xp.toLocaleString('en-US')}/${xpNeeded.toLocaleString('en-US')})`, inline: true },
          { name: '💰 ' + this.client.locale.translate(data.locale, 'economy.GLOBAL_MONEY'), value: profile.money.toString(), inline: true },
          { name: '💖 ' + this.client.locale.translate(data.locale, 'economy.LOVER'), value: profile.lover ? `<@${profile.lover}>` : this.client.locale.translate(data.locale, 'economy.SINGLE'), inline: true },
          { name: '⚧ ' + this.client.locale.translate(data.locale, 'economy.GENDER'), value: profile.gender, inline: true },
          { name: '🎂 ' + this.client.locale.translate(data.locale, 'economy.BIRTHDAY'), value: profile.birthday ? `${profile.birthday.toLocaleDateString(data.locale)} (${getAge(profile.birthday)})` : this.client.locale.translate(data.locale, 'economy.UNDISCLOSED'), inline: true }
        ]
      },
      components:
        user.id === (interaction.user ?? interaction.member)!.id
          ? [
              {
                type: Constants.ComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: Constants.ComponentTypes.BUTTON,
                    style: Constants.ButtonStyles.PRIMARY,
                    custom_id: `set_gender.${user.id}`,
                    label: this.client.locale.translate(data.locale, `economy.SET_GENDER`)
                  },
                  {
                    type: Constants.ComponentTypes.BUTTON,
                    style: Constants.ButtonStyles.PRIMARY,
                    custom_id: `set_color.${user.id}`,
                    label: this.client.locale.translate(data.locale, `economy.SET_COLOR`)
                  },
                  {
                    type: Constants.ComponentTypes.BUTTON,
                    style: Constants.ButtonStyles.DANGER,
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
