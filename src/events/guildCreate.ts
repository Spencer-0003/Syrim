/**
 * @file GuildCreate
 * @description Log new guilds
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { Guild } from 'eris';
import { Event } from '@core/Event';
import { COLORS } from '@utilities/Constants';

const whitelistedGuilds: string[] = [
  '264445053596991498' // top.gg
];

// Export class
export class GuildCreate extends Event {
  async run(guild: Guild): Promise<void> {
    if (await this.client.database.isBlacklisted(guild.id)) {
      await guild.leave();
      return;
    }

    const members = await guild.fetchMembers();
    const isBotFarm = members.filter(member => member.bot).length >= 50 && whitelistedGuilds.indexOf(guild.id) === -1;
    const webhook = await this.client.getOrCreateWebhook(process.env.NODE_ENV === 'development' ? process.env.DEVELOPMENT_LOGS : isBotFarm ? process.env.BOT_FARM_LOGS : process.env.JOINED_GUILD_LOGS);

    if (isBotFarm) this.client.database.createBlacklist(guild.id, 'Syrim', 'GUILD', 'Bot farm').then(guild.leave);

    this.client.executeWebhook(webhook.id, webhook.token!, {
      embed: {
        title: this.client.locale.translate(process.env.LOG_LOCALE, isBotFarm ? 'logs.JOINED_BOT_FARM' : 'logs.JOINED_GUILD'),
        color: isBotFarm ? COLORS.RED : COLORS.GREEN,
        thumbnail: { url: guild.iconURL ?? 'https://better-default-discord.netlify.app/Icons/Gradient-Red.png' },
        fields: [
          { name: this.client.locale.translate(process.env.LOG_LOCALE, 'logs.NAME'), value: guild.name, inline: true },
          { name: 'ID', value: guild.id, inline: true },
          { name: this.client.locale.translate(process.env.LOG_LOCALE, 'logs.OWNER'), value: `<@${guild.ownerID}>`, inline: true },
          { name: this.client.locale.translate(process.env.LOG_LOCALE, 'logs.MEMBER_COUNT'), value: members.filter(member => !member.bot).length.toString(), inline: true },
          { name: this.client.locale.translate(process.env.LOG_LOCALE, 'logs.BOT_COUNT'), value: members.filter(member => member.bot).length.toString(), inline: true }
        ],
        footer: { text: `${this.client.locale.translate(process.env.LOG_LOCALE, 'logs.TOTAL_GUILDS')}: ${(await this.client.getRESTGuilds()).length}` }
      }
    });
  }
}
