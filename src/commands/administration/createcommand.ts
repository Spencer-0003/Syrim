/**
 * @file CreateCommand
 * @description Create a custom command
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { Message } from 'eris';
import type { SyrimClient } from '@core/Client';
import type { CommandContext } from '@typings/command';
import { Constants } from 'eris';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

// Export class
export class CreateCommand extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'createcommand',
      description: 'Create a custom command.',
      category: 'administration',
      guildOnly: true,
      options: [
        {
          name: 'command_name',
          description: 'The name of the command.',
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: true
        },
        {
          name: 'command_description',
          description: 'The description of the command.',
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: true
        },
        {
          name: 'response',
          description: 'The response to the command.',
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: true
        }
      ]
    });
  }

  validate({ args, data }: CommandContext): [boolean, string] {
    return [/^[\w-]{1,32}$/.test(args.command_name as string), this.client.locale.translate(data.locale, 'administration.INVALID_COMMAND_NAME')];
  }

  async run({ interaction, args, data }: CommandContext): Promise<Message> {
    const commands = await this.client.getGuildCommands(interaction.guildID!);
    const existingCommand = commands.find(command => command.name === args.command_name);

    if (commands.length === 10 && data.profile.reputation === 'USER')
      return interaction.createFollowup({
        embed: {
          title: this.client.locale.translate(data.locale, 'global.ERROR'),
          description: this.client.locale.translate(data.locale, 'administration.MAX_COMMANDS_REACHED'),
          color: COLORS.RED
        }
      });
    else if (!existingCommand) {
      const newCommand = await this.client.createGuildCommand(interaction.guildID!, { name: args.command_name as string, description: args.command_description as string, type: Constants.ApplicationCommandTypes.CHAT_INPUT });
      await this.client.database.createCommand(interaction.guildID!, newCommand.id, args.response as string);
    }

    return interaction.createFollowup({
      embed: {
        title: this.client.locale.translate(data.locale, existingCommand ? 'global.ERROR' : 'administration.SUCCESSFULLY_CREATED_COMMAND'),
        description: this.client.locale.translate(data.locale, existingCommand ? 'administration.COMMAND_EXISTS' : 'administration.HOW_TO_USE_CUSTOM_COMMAND').replace('COMMAND', args.command_name as string),
        color: existingCommand ? COLORS.RED : COLORS.GREEN
      }
    });
  }
}
