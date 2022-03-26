/**
 * @file Unmute
 * @description Unmute a user in the guild
 * @author Spencer-0003
 */

// Import classes & types
import type { User } from 'eris';
import { Constants } from 'eris';
import type { SyrimClient } from '@core/Client';
import type { CommandContext } from '@typings/command';
import { COLORS } from '@utilities/Constants';
import { isSuperior } from '@utilities/ModerationUtilities';
import { Command } from '@core/Command';

// Export class
export class Unmute extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'unmute',
      description: 'Unmute a user in the guild.',
      category: 'moderation',
      guildOnly: true,
      userPermissions: ['moderateMembers'],
      clientPermissions: ['moderateMembers'],
      options: [
        {
          name: 'user',
          description: 'The user to mute.',
          type: Constants.ApplicationCommandOptionTypes.USER,
          required: true
        },
        {
          name: 'reason',
          description: 'The reason for the mute.',
          type: Constants.ApplicationCommandOptionTypes.STRING
        }
      ]
    });
  }

  validate({ args, data }: CommandContext): [boolean, string] {
    return [args.user !== this.client.user, this.client.locale.translate(data.locale, 'moderation.self.UNMUTE')];
  }

  async run({ interaction, args, data }: CommandContext): Promise<void> {
    let guildMember;
    try {
      guildMember = await this.client.getRESTGuildMember(interaction.guildID!, (args.user as User).id);
    } catch {
      return interaction.createMessage({
        embed: {
          title: this.client.locale.translate(data.locale, 'global.ERROR'),
          description: this.client.locale.translate(data.locale, 'moderation.MEMBER_NOT_IN_GUILD'),
          color: COLORS.RED
        }
      });
    }

    const superior = isSuperior(interaction.member!, guildMember);
    const reason = (args.reason as string) ?? this.client.locale.translate(data.locale, 'moderation.NO_REASON_PROVIDED');

    if (superior) await this.client.editGuildMember(interaction.guildID!, (args.user as User).id, { communicationDisabledUntil: null }, reason);
    return interaction.createMessage({
      embed: {
        title: this.client.locale.translate(data.locale, superior ? 'moderation.unmute.SUCCESS' : 'global.ERROR'),
        description: this.client.locale.translate(data.locale, superior ? 'moderation.unmute.DESCRIPTION' : 'moderation.NOT_SUPERIOR').replace('USER', (args.user as User).id),
        color: superior ? COLORS.GREEN : COLORS.RED,
        thumbnail: { url: (args.user as User).avatarURL },
        fields: !superior ? [] : [{ name: this.client.locale.translate(data.locale, 'moderation.REASON'), value: reason }]
      }
    });
  }
}
