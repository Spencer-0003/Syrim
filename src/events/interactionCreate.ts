/**
 * @file InteractionCreate
 * @description Event that fires at every interaction
 * @author Spencer-0003
 */

// Import classes & types
import type { CommandInteraction, ComponentInteraction, Message, TextChannel, InteractionDataOptionWithValue, Role, User, PartialChannel } from 'eris';
import type { Guild } from '@prisma/client';
import type { Data } from '@typings/command';
import { Constants } from 'eris';
import { COLORS } from '@utilities/Constants';
import { Event } from '@core/Event';

// Export event
export class InteractionCreate extends Event {
  async run(interaction: CommandInteraction | ComponentInteraction): Promise<Message | void> {
    const author = (interaction.user ?? interaction.member)!;
    const authorId = author.id;
    const guildId = interaction.guildID;
    const profile = await this.client.database.getUser(authorId);
    const guildData = guildId && (await this.client.database.getGuild(guildId));

    const data = {} as Data;
    data.profile = profile;
    data.guild = guildData as Guild;
    data.locale = data.guild ? data.guild.locale : data.profile.locale;

    if (interaction.type === Constants.InteractionTypes.APPLICATION_COMMAND) {
      const channel = interaction.channel as TextChannel;
      const cmd = this.client.commands.find(cmd => cmd.name === interaction.data.name);
      if (!cmd) return interaction.createFollowup({ content: this.client.locale.translate(data.locale, 'misc.COMMAND_NOT_FOUND') });
      else if (cmd.ownerOnly && authorId !== '806037166701674511') return interaction.createMessage({ content: this.client.locale.translate(data.locale, 'misc.COMMAND_OWNER_ONLY'), flags: Constants.MessageFlags.EPHEMERAL });
      else if (cmd.guildOnly && !guildId) return interaction.createMessage({ content: this.client.locale.translate(data.locale, 'misc.COMMAND_GUILD_ONLY'), flags: Constants.MessageFlags.EPHEMERAL });
      else if (cmd.category === 'nsfw' && guildId && !channel.nsfw) return interaction.createMessage({ content: this.client.locale.translate(data.locale, 'misc.COMMAND_NSFW_ONLY'), flags: Constants.MessageFlags.EPHEMERAL });

      const args: Record<string, string | boolean | number | Role | User | PartialChannel> = {};
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

      await interaction.acknowledge((cmd.name === 'help' && Constants.MessageFlags.EPHEMERAL) as number);

      if (data.guild) {
        if (data.guild.disabledCategories.indexOf(cmd.category) > -1)
          return interaction.createFollowup({
            embeds: [
              {
                title: this.client.locale.translate(data.locale, 'global.ERROR'),
                description: this.client.locale.translate(data.locale, 'misc.CATEGORY_DISABLED'),
                color: COLORS.RED
              }
            ]
          });

        const permissions = channel.permissionsOf(this.client.user.id);
        const missingClientPerms = cmd.clientPermissions.filter(permission => !permissions?.has(permission));
        const missingUserPerms = cmd.userPermissions.filter(permission => !permissions?.has(permission));
        if ((cmd.clientPermissions || cmd.userPermissions) && (missingClientPerms.length || missingUserPerms.length))
          return interaction.createFollowup({
            embeds: [
              {
                title: this.client.locale.translate(data.locale, 'misc.MISSING_PERMISSIONS'),
                description: `${this.client.locale.translate(data.locale, missingClientPerms.length ? 'misc.BOT_REQUIRED_PERMISSIONS' : 'misc.USER_REQUIRED_PERMISSIONS')} ${(missingClientPerms.length ? missingClientPerms : missingUserPerms).join(', ')}`,
                color: COLORS.RED
              }
            ]
          });
      }

      cmd.run(interaction, args, data);
    } else if (interaction.type === Constants.InteractionTypes.MESSAGE_COMPONENT) {
      const customId = interaction.data.custom_id;
      const user = interaction.data.custom_id.split('.').slice(-1)[0];
      const locale = guildData ? guildData.locale : profile.locale;

      await interaction.acknowledge();
      if (interaction.member && user !== interaction.member.id) return interaction.createFollowup({ content: this.client.locale.translate(locale, 'misc.NOT_YOUR_BUTTON'), flags: Constants.MessageFlags.EPHEMERAL });
      this.client.componentCallbacks[Object.keys(this.client.componentCallbacks).filter(id => customId === id || customId.startsWith(id))[0]](interaction, customId, data);
    }
  }
}
