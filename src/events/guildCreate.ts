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
    if (await this.client.database.getBlacklist(guild.id)) {
      await guild.leave();
      return;
    }

    const members = await guild.fetchMembers();
    const isBotFarm = members.filter(member => member.bot).length >= 50 && whitelistedGuilds.indexOf(guild.id) === -1;
    const webhook = await this.client.getOrCreateWebhook(isBotFarm ? '934399418168377354' : '934399565749162024');

    if (isBotFarm) this.client.database.createBlacklist(guild.id, 'Syrim', 'GUILD', 'Bot farm').then(guild.leave);

    this.client.executeWebhook(webhook.id, webhook.token!, {
      embed: {
        title: isBotFarm ? 'Attempted to Join a Bot Farm' : 'Joined a Guild',
        color: isBotFarm ? COLORS.RED : COLORS.GREEN,
        thumbnail: { url: guild.iconURL ?? 'https://better-default-discord.netlify.app/Icons/Gradient-Red.png' },
        fields: [
          { name: 'Name', value: guild.name, inline: true },
          { name: 'ID', value: guild.id, inline: true },
          { name: 'Owner', value: `<@${guild.ownerID}>`, inline: true },
          { name: 'Member Count', value: members.filter(member => !member.bot).length.toString(), inline: true },
          { name: 'Bot Count', value: members.filter(member => member.bot).length.toString(), inline: true }
        ],
        footer: { text: `Total guilds: ${(await this.client.getRESTGuilds()).length}` }
      }
    });
  }
}
