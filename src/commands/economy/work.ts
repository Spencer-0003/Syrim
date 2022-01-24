/**
 * @file Work
 * @description Work for some money
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { CommandInteraction, Message } from 'eris';
import type { SyrimClient } from '@core/Client';
import type { Data } from '@typings/command';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';
import moment from 'moment';

export class Work extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'work',
      description: 'Work for some money.',
      category: 'economy',
      guildOnly: true
    });
  }

  async run(interaction: CommandInteraction, _args: Record<string, string>, data: Data): Promise<Message> {
    const cooldownRecord = await this.client.redis.get(`work_cooldown:${interaction.member!.id}`);
    if (cooldownRecord)
      return interaction.createFollowup({
        embeds: [
          {
            title: this.client.locale.translate(data.locale, 'global.ERROR'),
            description: this.client.locale.translate(data.locale, 'economy.WORK_COOLDOWN').replace('TIME', moment(parseInt(cooldownRecord)).locale(data.locale).fromNow(true)),
            color: COLORS.RED
          }
        ]
      });

    const cashAmount = Math.floor(Math.random() * 10) + 1;
    await this.client.redis.set(`work_cooldown:${interaction.member!.id}`, Date.now() + 14400000, 'EX', 14400);
    await this.client.database.updateUser(interaction.member!.id, { money: data.profile.money + cashAmount });
    return interaction.createFollowup({
      embeds: [
        {
          title: this.client.locale.translate(data.locale, 'economy.WORK'),
          description: this.client.locale.translate(data.locale, 'economy.SUCCESSFULLY_WORKED').replace('MONEY', cashAmount.toString()),
          color: COLORS.GREEN
        }
      ]
    });
  }
}
