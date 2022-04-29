/**
 * @file Help
 * @description Shows all commands and categories
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { ActionRow, EmbedField } from 'eris';
import type { SyrimClient } from '@core/Client';
import type { CommandContext } from '@typings/command';
import { Constants, GuildChannel } from 'eris';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

// Export class
export class Help extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'help',
      name_localizations: {
        'es-ES': 'ayuda'
      },
      description: 'Get a list of my commands.',
      description_localizations: {
        'es-ES': 'Obtener una lista de mis comandos.'
      },
      category: 'info',
      options: [
        {
          name: 'command_or_category',
          name_localizations: {
            'es-ES': 'comando_o_categoría'
          },
          description: 'Command or category to get info about.',
          description_localizations: {
            'es-ES': 'Comando o categoría sobre la que obtener información.'
          },
          type: Constants.ApplicationCommandOptionTypes.STRING
        }
      ]
    });
  }

  run({ interaction, args, data }: CommandContext): Promise<void> {
    const isCommand = args.command_or_category && this.client.commands.find(cmd => cmd.name === (args.command_or_category as string).toLowerCase());
    const isCategory = args.command_or_category && !isCommand && this.client.categories.find(cat => cat === (args.command_or_category as string).toLowerCase());
    const components: ActionRow[] = [{ type: Constants.ComponentTypes.ACTION_ROW, components: [] }];
    const fields: EmbedField[] = [];

    this.client.categories.forEach(category => {
      if (components[components.length - 1].components.length >= 5) components.push({ type: Constants.ComponentTypes.ACTION_ROW, components: [] });
      components[components.length - 1].components.push({
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.PRIMARY,
        disabled: isCategory === category,
        custom_id: `help-${category}.${(interaction.user ?? interaction.member)!.id}`,
        label: this.client.locale.translate(data.locale, `categories.${category.toUpperCase()}`)
      });
    });

    if (isCategory) {
      this.client.commands
        .filter(cmd => cmd.category === isCategory)
        .forEach(cmd =>
          fields.push({
            name: cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1),
            value: cmd.description,
            inline: true
          })
        );

      if (data.guild?.disabledCategories.indexOf(isCategory) !== -1)
        return interaction.createMessage({
          embed: {
            title: this.client.locale.translate(data.locale, 'global.ERROR'),
            description: this.client.locale.translate(data.locale, 'misc.CATEGORY_DISABLED'),
            color: COLORS.RED
          }
        });

      const channelIsNsfw = interaction.channel instanceof GuildChannel && interaction.channel.nsfw;
      return interaction.createMessage({
        embed: {
          title: isCategory === 'nsfw' ? 'NSFW' : isCategory.charAt(0).toUpperCase() + isCategory.slice(1),
          description: isCategory === 'nsfw' && !channelIsNsfw ? this.client.locale.translate(data.locale, 'misc.CHANNEL_NOT_NSFW') : this.client.locale.translate(data.locale, `category_descriptions.${isCategory.toUpperCase()}`),
          color: isCategory === 'nsfw' && !channelIsNsfw ? COLORS.RED : COLORS.GREEN,
          fields: isCategory === 'nsfw' && !channelIsNsfw ? [] : fields
        },
        components
      });
    }

    if (isCommand) {
      let usage = `\`/${isCommand.name}`;
      isCommand.options?.forEach(option => (usage += ` [${option.name}]`));
      usage += '`';
      return interaction.createMessage({
        embed: {
          title: isCommand.name.charAt(0).toUpperCase() + isCommand.name.slice(1),
          description: isCommand.description,
          color: COLORS.GREEN,
          fields: [
            { name: this.client.locale.translate(data.locale, 'general.USAGE'), value: usage, inline: false },
            { name: this.client.locale.translate(data.locale, 'general.HELP_PERMISSIONS_I_NEED'), value: isCommand.clientPermissions.join(', ') ?? this.client.locale.translate(data.locale, 'global.NONE'), inline: false }
          ]
        },
        components
      });
    }

    components.push({
      type: Constants.ComponentTypes.ACTION_ROW,
      components: [
        {
          type: Constants.ComponentTypes.BUTTON,
          style: Constants.ButtonStyles.LINK,
          label: this.client.locale.translate(data.locale, 'general.JOIN_THE_DISCORD'),
          url: 'https://discord.gg/P5T7MQvPEG'
        },
        {
          type: Constants.ComponentTypes.BUTTON,
          style: Constants.ButtonStyles.LINK,
          label: this.client.locale.translate(data.locale, 'general.BECOME_A_DONATOR'),
          url: 'https://ko-fi.com/spencer0003'
        },
        {
          type: Constants.ComponentTypes.BUTTON,
          style: Constants.ButtonStyles.LINK,
          label: this.client.locale.translate(data.locale, 'general.INVITE_ME'),
          url: `https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8560045566&scope=bot%20applications.commands`
        }
      ]
    });

    this.client.categories.forEach(category =>
      fields.push({
        name: this.client.locale.translate(data.locale, `categories.${category.toUpperCase()}`),
        value: this.client.locale.translate(data.locale, `category_descriptions.${category.toUpperCase()}`),
        inline: true
      })
    );

    return interaction.createMessage({
      embed: {
        title: this.client.locale.translate(data.locale, 'general.HELP'),
        description: this.client.locale.translate(data.locale, 'general.HELP_DESCRIPTION'),
        color: COLORS.GREEN,
        fields,
        thumbnail: { url: this.client.user.avatarURL },
        footer: { text: this.client.locale.translate(data.locale, 'misc.COMMANDS_LOADED').replace('COMMANDS_LOADED', this.client.commands.length.toString()) }
      },
      components
    });
  }
}
