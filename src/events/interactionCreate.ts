/**
 * @file InteractionCreate
 * @description Handle application commands and components
 * @author Spencer-0003
 */

// Import classes & types
import type { CommandInteraction, ComponentInteraction, ModalSubmitInteraction, TextChannel, InteractionDataOptionWithValue, InteractionDataOption, InteractionDataOptionSubCommandGroup } from 'eris';
import type { Guild } from '@prisma/client';
import type { CommandContext, Data } from '@typings/command';
import { Constants } from 'eris';
import { COLORS } from '@utilities/Constants';
import { Event } from '@core/Event';

// Export event
export class InteractionCreate extends Event {
  private resolveArgs(interaction: CommandInteraction, options?: InteractionDataOption[]): CommandContext['args'] {
    let args: CommandContext['args'] = {};

    options?.forEach(option => {
      switch (option.type) {
        case Constants.ApplicationCommandOptionTypes.USER:
          args[option.name] = interaction.data.resolved!.users!.get(option.value)!;
          break;
        case Constants.ApplicationCommandOptionTypes.CHANNEL:
          args[option.name] = interaction.data.resolved!.channels!.get(option.value)!;
          break;
        case Constants.ApplicationCommandOptionTypes.ROLE:
          args[option.name] = interaction.data.resolved!.roles!.get(option.value)!;
          break;
        case Constants.ApplicationCommandOptionTypes.SUB_COMMAND:
          args = this.resolveArgs(interaction, options);
          args.subCommand = option.name;
          break;
        case Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP:
          args = this.resolveArgs(interaction, (option as InteractionDataOptionSubCommandGroup).options);
          break;
        default:
          args[option.name] = (option as InteractionDataOptionWithValue).value;
          break;
      }
    });

    return args;
  }

  async run(interaction: CommandInteraction | ComponentInteraction | ModalSubmitInteraction): Promise<void> {
    const author = (interaction.user ?? interaction.member)!;
    const guildId = interaction.guildID;
    const locale = interaction.guildLocale ?? interaction.locale;

    if (await this.client.database.isBlacklisted(author.id))
      return interaction.createMessage({
        flags: Constants.MessageFlags.EPHEMERAL,
        embed: {
          title: this.client.locale.translate(locale, 'global.ERROR'),
          description: this.client.locale.translate(locale, 'blacklist.USER_BLACKLISTED'),
          color: COLORS.RED
        },
        components: [
          {
            type: Constants.ComponentTypes.ACTION_ROW,
            components: [
              {
                type: Constants.ComponentTypes.BUTTON,
                style: Constants.ButtonStyles.LINK,
                label: this.client.locale.translate(locale, 'general.JOIN_THE_DISCORD'),
                url: 'https://discord.gg/P5T7MQvPEG'
              }
            ]
          }
        ]
      });

    const data: Data = {
      profile: await this.client.database.getUser(author.id),
      guild: (guildId && (await this.client.database.getGuild(guildId))) as Guild,
      locale
    };

    if (interaction.type === Constants.InteractionTypes.APPLICATION_COMMAND) {
      const channel = interaction.channel as TextChannel;
      const cmd = this.client.commands.find(c => c.name === interaction.data.name);

      if (!cmd) {
        const customCommand = await this.client.database.findCommand(interaction.data.id);
        return interaction.createMessage({ content: customCommand?.response ?? this.client.locale.translate(data.locale, 'misc.COMMAND_NOT_FOUND') });
      } else if (cmd.ownerOnly && author.id !== process.env.OWNER_ID) return interaction.createMessage({ content: this.client.locale.translate(data.locale, 'misc.COMMAND_OWNER_ONLY'), flags: Constants.MessageFlags.EPHEMERAL });
      else if (cmd.category === 'nsfw' && !channel.nsfw) return interaction.createMessage({ content: this.client.locale.translate(data.locale, 'misc.COMMAND_NSFW_ONLY'), flags: Constants.MessageFlags.EPHEMERAL });

      await interaction.acknowledge((interaction.data.name === 'help' && Constants.MessageFlags.EPHEMERAL) as number);

      const args = this.resolveArgs(interaction, interaction.data.options);

      if (data.guild) {
        if (data.guild.disabledCategories.indexOf(cmd.category) > -1)
          return interaction.createMessage({
            flags: Constants.MessageFlags.EPHEMERAL,
            embed: {
              title: this.client.locale.translate(data.locale, 'global.ERROR'),
              description: this.client.locale.translate(data.locale, 'misc.CATEGORY_DISABLED'),
              color: COLORS.RED
            }
          });

        const missingPerms = cmd.clientPermissions.filter(permission => !channel.permissionsOf(this.client.user.id).has(permission));
        if (missingPerms.length)
          return interaction.createMessage({
            flags: Constants.MessageFlags.EPHEMERAL,
            embed: {
              title: this.client.locale.translate(data.locale, 'misc.MISSING_PERMISSIONS'),
              description: `${this.client.locale.translate(data.locale, 'misc.BOT_REQUIRED_PERMISSIONS')} ${missingPerms.join(', ')}`,
              color: COLORS.RED
            }
          });
      }

      if (cmd.voterOnly && author.id !== process.env.OWNER_ID && !this.client.database.redis.get(`voted:${author.id}`))
        /* TODO: Add button with voting link when ready. */
        return interaction.createMessage({
          flags: Constants.MessageFlags.EPHEMERAL,
          embed: {
            title: this.client.locale.translate(data.locale, 'vote.TITLE'),
            description: this.client.locale.translate(data.locale, 'vote.DESCRIPTION'),
            color: COLORS.RED
          }
        });

      if (cmd.validate) {
        const [validated, errorMessage] = cmd.validate({ interaction, args, data });

        if (!validated)
          return interaction.createMessage({
            flags: Constants.MessageFlags.EPHEMERAL,
            embed: {
              title: this.client.locale.translate(data.locale, 'global.ERROR'),
              description: errorMessage,
              color: COLORS.RED
            }
          });
      }

      if (process.env.NODE_ENV === 'production') this.client.statcord?.postCommand(cmd.name, author.id);
      cmd.run({ interaction, args, data });
    } else if (interaction.type === Constants.InteractionTypes.MESSAGE_COMPONENT || interaction.type === Constants.InteractionTypes.MODAL_SUBMIT) {
      const customId = interaction.data.custom_id;
      const user = customId.split('.').slice(-1)[0];

      if (interaction.member && user !== interaction.member.id) return interaction.createMessage({ content: this.client.locale.translate(data.locale, 'misc.NOT_YOUR_BUTTON'), flags: Constants.MessageFlags.EPHEMERAL });
      this.client.componentCallbacks.find(cb => cb.id === customId || customId.startsWith(cb.id))?.callback(interaction, customId, data);
    }
  }
}
