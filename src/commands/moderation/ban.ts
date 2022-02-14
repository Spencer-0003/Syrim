/**
 * @file Ban
 * @description Ban a user from the guild
 * @author Spencer-0003
 */

// Import classes & types
import type { User } from 'eris';
import { Constants, Message } from 'eris';
import type { SyrimClient } from '@core/Client';
import type { CommandContext } from '@typings/command';
import { COLORS } from '@utilities/Constants';
import { isSuperior } from '@utilities/ModerationUtilities';
import { Command } from '@core/Command';

// Export class
export class Ban extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'ban',
      description: 'Ban a user from the guild.',
      category: 'moderation',
      guildOnly: true,
      userPermissions: ['banMembers'],
      clientPermissions: ['banMembers'],
      options: [
        {
          name: 'user',
          description: 'The user to ban.',
          type: Constants.ApplicationCommandOptionTypes.USER,
          required: true
        },
        {
          name: 'reason',
          description: 'The reason for the ban.',
          type: Constants.ApplicationCommandOptionTypes.STRING
        }
      ]
    });
  }

  validate({ args, data }: CommandContext): [boolean, string] {
    return [args.user !== this.client.user, this.client.locale.translate(data.locale, 'moderation.BAN_SYRIM')];
  }

  async run({ interaction, args, data }: CommandContext): Promise<Message> {
    const guildMember = await this.client.getRESTGuildMember(interaction.guildID!, interaction.member!.id);
    const superior = !guildMember ? true : isSuperior(interaction.member!, guildMember);
    const reason = (args.reason as string) ?? this.client.locale.translate(data.locale, 'moderation.NO_REASON_PROVIDED');

    if (superior) await this.client.banGuildMember(interaction.guildID!, (args.user as User).id, 0, reason);
    return interaction.createFollowup({
      embed: {
        title: this.client.locale.translate(data.locale, superior ? 'moderation.SUCCESSFULLY_BANNED' : 'global.ERROR'),
        description: this.client.locale.translate(data.locale, superior ? 'moderation.SUCCESSFULLY_BANNED_DESCRIPTION' : 'moderation.NOT_SUPERIOR').replace('USER', (args.user as User).id),
        color: superior ? COLORS.GREEN : COLORS.RED,
        thumbnail: { url: (args.user as User).avatarURL },
        fields: !superior ? [] : [{ name: this.client.locale.translate(data.locale, 'moderation.REASON'), value: reason }]
      }
    });
  }
}
