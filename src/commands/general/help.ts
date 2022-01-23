/**
 * @file Help
 * @description Shows all commands and categories
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { ActionRow, CommandInteraction, EmbedField, Message, TextChannel } from 'eris';
import type { SyrimClient } from '@core/Client';
import type { Data } from '@typings/command';
import { Constants } from 'eris';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

// Export class
export class Help extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'help',
      description: 'Get a list of my commands.',
      category: 'general',
      options: [
        {
          name: 'command_or_category',
          description: 'Command or category to get info about.',
          type: Constants.ApplicationCommandOptionTypes.STRING
        }
      ]
    });
  }

  run(interaction: CommandInteraction, args: Record<string, string>, data: Data): Promise<Message> {
    const isCommand = args.command_or_category && this.client.commands.find(cmd => cmd?.name === args.command_or_category.toLowerCase());
    const isCategory = args.command_or_category && !isCommand && this.client.categories.find(cat => cat === args.command_or_category.toLowerCase());
    const components: ActionRow[] = [{ type: Constants.ComponentTypes.ACTION_ROW, components: [] }];
    const fields: EmbedField[] = [];

    this.client.categories.forEach(category =>
      components[0].components.push({
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.PRIMARY,
        disabled: isCategory === category,
        custom_id: `help-${category}.${(interaction.user ?? interaction.member)!.id}`,
        label: this.client.locale.translate(data.locale, `categories.${category.toUpperCase()}`)
      })
    );

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
        return interaction.createFollowup({
          embeds: [
            {
              title: this.client.locale.translate(data.locale, 'global.ERROR'),
              description: this.client.locale.translate(data.locale, 'misc.CATEGORY_DISABLED'),
              color: COLORS.RED
            }
          ]
        });

      const isNsfw = isCategory === 'nsfw';
      return interaction.createFollowup({
        embeds: [
          {
            title: isNsfw ? 'NSFW' : isCategory.charAt(0).toUpperCase() + isCategory.slice(1),
            description: isNsfw && !(interaction.channel as TextChannel).nsfw ? this.client.locale.translate(data.locale, 'misc.CHANNEL_NOT_NSFW') : this.client.locale.translate(data.locale, `category_descriptions.${isCategory.toUpperCase()}`),
            color: isNsfw && !(interaction.channel as TextChannel).nsfw ? COLORS.RED : COLORS.GREEN,
            fields: isNsfw && !(interaction.channel as TextChannel).nsfw ? [] : fields
          }
        ],
        components
      });
    }

    if (isCommand) {
      const userNeeded = isCommand.userPermissions.join(', ');
      let usage = `\`/${isCommand.name}`;
      isCommand.options?.forEach(option => (usage += ` [${option.name}]`));
      usage += '`';
      return interaction.createFollowup({
        embeds: [
          {
            title: isCommand.name.charAt(0).toUpperCase() + isCommand.name.slice(1),
            description: isCommand.description,
            color: COLORS.GREEN,
            fields: [
              { name: this.client.locale.translate(data.locale, 'general.USAGE'), value: usage, inline: false },
              { name: this.client.locale.translate(data.locale, 'general.HELP_PERMISSIONS_YOU_NEED'), value: userNeeded !== '' ? userNeeded : this.client.locale.translate(data.locale, 'global.NONE'), inline: false },
              { name: this.client.locale.translate(data.locale, 'general.HELP_PERMISSIONS_I_NEED'), value: isCommand.clientPermissions.join(', '), inline: false }
            ]
          }
        ],
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
          url: 'https://github.com/Spencer-0003/Syrim/blob/master/README.md#donations'
        },
        {
          type: Constants.ComponentTypes.BUTTON,
          style: Constants.ButtonStyles.LINK,
          label: this.client.locale.translate(data.locale, 'general.INVITE_ME'),
          url: 'https://discord.com/api/oauth2/authorize?client_id=862765256929706035&permissions=8560045566&scope=bot%20applications.commands'
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

    return interaction.createFollowup({
      embeds: [
        {
          title: this.client.locale.translate(data.locale, 'general.HELP'),
          description: this.client.locale.translate(data.locale, 'general.HELP_DESCRIPTION'),
          color: COLORS.GREEN,
          fields,
          thumbnail: { url: this.client.user.avatarURL },
          footer: { text: `${this.client.commands.length} commands loaded` }
        }
      ],
      components
    });
  }
}
