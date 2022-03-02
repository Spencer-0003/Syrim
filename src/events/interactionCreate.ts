/**
 * @file InteractionCreate
 * @description Handle application commands and components
 * @author Spencer-0003
 */

// Import classes & types
import type { CommandInteraction, ComponentInteraction, ModalSubmitInteraction, TextChannel, InteractionDataOptionWithValue } from 'eris';
import type { Guild } from '@prisma/client';
import type { CommandContext, Data } from '@typings/command';
import { Constants } from 'eris';
import { COLORS } from '@utilities/Constants';
import { Event } from '@core/Event';

// Export event
export class InteractionCreate extends Event {
  async run(interaction: CommandInteraction | ComponentInteraction | ModalSubmitInteraction): Promise<void> {
    const author = (interaction.user ?? interaction.member)!;
    const guildId = interaction.guildID;
    const locale = interaction.guildLocale ?? interaction.locale;

    if (await this.client.database.getBlacklist(author.id))
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

    if (interaction.type === Constants.InteractionTypes.APPLICATION_COMMAND && interaction.data.name === 'help')
      // Why the actual fuck can't we use modals on acknowledged interactions???? I FUCKING HATE the Discord API
      await interaction.acknowledge(Constants.MessageFlags.EPHEMERAL);

    if (interaction.type === Constants.InteractionTypes.APPLICATION_COMMAND) {
      const channel = interaction.channel as TextChannel;
      const cmd = this.client.commands.find(c => c.name === interaction.data.name);

      if (!cmd) {
        const customCommand = await this.client.database.findCommand(interaction.data.id);
        return interaction.createMessage({ content: customCommand?.response ?? this.client.locale.translate(data.locale, 'misc.COMMAND_NOT_FOUND') });
      } else if (cmd.ownerOnly && author.id !== '806037166701674511') return interaction.createMessage({ content: this.client.locale.translate(data.locale, 'misc.COMMAND_OWNER_ONLY'), flags: Constants.MessageFlags.EPHEMERAL });
      else if (cmd.guildOnly && !guildId) return interaction.createMessage({ content: this.client.locale.translate(data.locale, 'misc.COMMAND_GUILD_ONLY'), flags: Constants.MessageFlags.EPHEMERAL });
      else if (cmd.category === 'nsfw' && guildId && !channel.nsfw) return interaction.createMessage({ content: this.client.locale.translate(data.locale, 'misc.COMMAND_NSFW_ONLY'), flags: Constants.MessageFlags.EPHEMERAL });

      const args: CommandContext['args'] = {};
      interaction.data.options?.forEach(option => {
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
          default:
            args[option.name] = (option as InteractionDataOptionWithValue).value;
            break;
        }
      });

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

        const permissions = channel.permissionsOf(this.client.user.id);
        const missingClientPerms = cmd.clientPermissions.filter(permission => !permissions.has(permission));
        const missingUserPerms = cmd.userPermissions?.filter(permission => !permissions.has(permission));
        if (missingClientPerms.length ?? missingUserPerms?.length)
          return interaction.createMessage({
            flags: Constants.MessageFlags.EPHEMERAL,
            embed: {
              title: this.client.locale.translate(data.locale, 'misc.MISSING_PERMISSIONS'),
              description: `${this.client.locale.translate(data.locale, missingClientPerms.length ? 'misc.BOT_REQUIRED_PERMISSIONS' : 'misc.USER_REQUIRED_PERMISSIONS')} ${(missingClientPerms.length ? missingClientPerms : missingUserPerms!).join(', ')}`,
              color: COLORS.RED
            }
          });
      }

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

      if (process.env.NODE_ENV === 'production' && process.env.STATCORD_API_KEY) this.client.statcord.postCommand(cmd.name, author.id);
      cmd.run({ interaction, args, data });
    } else if (interaction.type === Constants.InteractionTypes.MESSAGE_COMPONENT || interaction.type === Constants.InteractionTypes.MODAL_SUBMIT) {
      const customId = interaction.data.custom_id;
      const user = customId.split('.').slice(-1)[0];

      if (user !== interaction.member?.id) return interaction.createMessage({ content: this.client.locale.translate(data.locale, 'misc.NOT_YOUR_BUTTON'), flags: Constants.MessageFlags.EPHEMERAL });
      this.client.componentCallbacks.find(cb => cb.id === customId || customId.startsWith(cb.id))?.callback(interaction, customId, data);
    }
  }
}
