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
      name_localizations: {
        'es-ES': 'un mudo'
      },
      description: 'Unmute a user in the guild.',
      description_localizations: {
        'es-ES': 'un mudo de un usuario en el gremio.'
      },
      category: 'moderation',
      guildOnly: true,
      userPermissions: Constants.Permissions.moderateMembers.toString(),
      clientPermissions: ['moderateMembers'],
      options: [
        {
          name: 'user',
          name_localizations: {
            'es-ES': 'usuario'
          },
          description: 'The user to unmute.',
          description_localizations: {
            'es-ES': 'El usuario para desactivar el silencio.'
          },
          type: Constants.ApplicationCommandOptionTypes.USER,
          required: true
        },
        {
          name: 'reason',
          name_localizations: {
            'es-ES': 'razón'
          },
          description: 'The reason for the unmute.',
          description_localizations: {
            'es-ES': 'La razón del un mudo.'
          },
          type: Constants.ApplicationCommandOptionTypes.STRING
        }
      ]
    });
  }

  validate({ args, data }: CommandContext): [boolean, string] {
    return [args.user !== this.client.user, this.client.locale.translate(data.locale, 'moderation.self.UNMUTE')];
  }

  async run({ interaction, args, data }: CommandContext): Promise<void> {
    const guildMember = await this.client.getRESTGuildMember(interaction.guildID!, (args.user as User).id).catch(() => interaction.createMessage({
      embed: {
        title: this.client.locale.translate(data.locale, 'global.ERROR'),
        description: this.client.locale.translate(data.locale, 'moderation.MEMBER_NOT_IN_GUILD'),
        color: COLORS.RED
      }
    }));

    if (!guildMember) return;

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
