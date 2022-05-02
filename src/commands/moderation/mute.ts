/**
 * @file Mute
 * @description Mute a user in the guild
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
export class Mute extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'mute',
      name_localizations: {
        'es-ES': 'mudo'
      },
      description: 'Mute a user in the guild.',
      description_localizations: {
        'es-ES': 'Silenciar a un usuario en el gremio.'
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
          description: 'The user to mute.',
          description_localizations: {
            'es-ES': 'El usuario para silenciar.'
          },
          type: Constants.ApplicationCommandOptionTypes.USER,
          required: true
        },
        {
          name: 'time',
          name_localizations: {
            'es-ES': 'hora'
          },
          description: 'The time to mute the user for.',
          description_localizations: {
            'es-ES': 'El tiempo para silenciar al usuario.'
          },
          type: Constants.ApplicationCommandOptionTypes.NUMBER,
          choices: [
            {
              name: '60 seconds',
              name_localizations: {
                'es-ES': '60 segundos'
              },
              value: 60000
            },
            {
              name: '5 minutes',
              name_localizations: {
                'es-ES': '5 minutos'
              },
              value: 300000
            },
            {
              name: '10 minutes',
              name_localizations: {
                'es-ES': '10 minutos'
              },
              value: 600000
            },
            {
              name: '1 hour',
              name_localizations: {
                'es-ES': '1 hora'
              },
              value: 3600000
            },
            {
              name: '1 day',
              name_localizations: {
                'es-ES': '1 día'
              },
              value: 86400000
            },
            {
              name: '1 week',
              name_localizations: {
                'es-ES': '1 semana'
              },
              value: 604800000
            }
          ],
          required: true
        },
        {
          name: 'reason',
          name_localizations: {
            'es-ES': 'razon'
          },
          description: 'The reason for the mute.',
          description_localizations: {
            'es-ES': 'La razón del mudo.'
          },
          type: Constants.ApplicationCommandOptionTypes.STRING
        }
      ]
    });
  }

  validate({ args, data }: CommandContext): [boolean, string] {
    return [args.user !== this.client.user, this.client.locale.translate(data.locale, 'moderation.self.MUTE')];
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

    if (superior) await this.client.editGuildMember(interaction.guildID!, (args.user as User).id, { communicationDisabledUntil: new Date(Date.now() + (args.time as number)) }, reason);
    return interaction.createMessage({
      embed: {
        title: this.client.locale.translate(data.locale, superior ? 'moderation.mute.SUCCESS' : 'global.ERROR'),
        description: this.client.locale.translate(data.locale, superior ? 'moderation.mute.DESCRIPTION' : 'moderation.NOT_SUPERIOR').replace('USER', (args.user as User).id),
        color: superior ? COLORS.GREEN : COLORS.RED,
        thumbnail: { url: (args.user as User).avatarURL },
        fields: !superior ? [] : [{ name: this.client.locale.translate(data.locale, 'moderation.REASON'), value: reason }]
      }
    });
  }
}
