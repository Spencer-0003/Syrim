/**
 * @file DeleteCommand
 * @description Delete a custom command
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { SyrimClient } from '@core/Client';
import type { CommandContext } from '@typings/command';
import { Constants } from 'eris';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

// Export class
export class DeleteCommand extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'deletecommand',
      name_localizations: {
        'es-ES': 'eliminarcomando'
      },
      description: 'Delete a custom command.',
      description_localizations: {
        'es-ES': 'Eliminar un comando personalizado.'
      },
      category: 'administration',
      guildOnly: true,
      options: [
        {
          name: 'command_name',
          name_localizations: {
            'es-ES': 'nombre_comando'
          },
          description: 'The name of the command.',
          description_localizations: {
            'es-ES': 'El nombre del comando.'
          },
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: true
        }
      ]
    });
  }

  validate({ args, data }: CommandContext): [boolean, string] {
    return [/^[\w-]{1,32}$/.test(args.command_name as string), this.client.locale.translate(data.locale, 'administration.INVALID_COMMAND_NAME')];
  }

  async run({ interaction, args, data }: CommandContext): Promise<void> {
    const commands = await this.client.getGuildCommands(interaction.guildID!);
    const existingCommand = commands.find(command => command.name === args.command_name);

    if (existingCommand) {
      await this.client.deleteGuildCommand(interaction.guildID!, existingCommand.id);
      await this.client.database.deleteCommand(existingCommand.id);
    }

    return interaction.createMessage({
      embed: {
        title: this.client.locale.translate(data.locale, !existingCommand ? 'global.ERROR' : 'administration.SUCCESSFULLY_DELETED_COMMAND'),
        description: this.client.locale.translate(data.locale, !existingCommand ? 'administration.COMMAND_DOES_NOT_EXIST' : 'administration.SUCCESSFULLY_DELETED_COMMAND_DESCRIPTION').replace('COMMAND', args.command_name as string),
        color: !existingCommand ? COLORS.RED : COLORS.GREEN
      }
    });
  }
}
