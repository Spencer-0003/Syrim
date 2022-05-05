/**
 * @file GuildDelete
 * @description Log guild laves
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { Guild } from 'eris';
import { Event } from '@core/Event';
import { COLORS } from '@utilities/Constants';

// Export class
export class GuildDelete extends Event {
  async run(guild: Guild): Promise<void> {
    if (await this.client.database.isBlacklisted(guild.id)) return;

    const webhook = await this.client.getOrCreateWebhook(process.env.NODE_ENV === 'development' ? process.env.DEVELOPMENT_LOGS : process.env.LEFT_GUILD_LOGS);
    this.client.executeWebhook(webhook.id, webhook.token!, {
      embed: {
        title: this.client.locale.translate(process.env.LOG_LOCALE, 'logs.LEFT_GUILD'),
        color: COLORS.RED,
        thumbnail: { url: guild.iconURL ?? 'https://better-default-discord.netlify.app/Icons/Gradient-Red.png' },
        fields: [
          { name: this.client.locale.translate(process.env.LOG_LOCALE, 'logs.NAME'), value: guild.name, inline: true },
          { name: 'ID', value: guild.id, inline: true },
          { name: this.client.locale.translate(process.env.LOG_LOCALE, 'logs.OWNER'), value: `<@${guild.ownerID}>`, inline: true }
        ],
        footer: { text: `${this.client.locale.translate(process.env.LOG_LOCALE, 'logs.TOTAL_GUILDS')}: ${(await this.client.getRESTGuilds()).length}` }
      }
    });
  }
}
