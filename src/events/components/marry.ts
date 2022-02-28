/**
 * @file Marry
 * @description Marry component callback
 * @author Spencer-0003
 */

// Import classes, constants & types
import type { ComponentInteraction } from 'eris';
import type { Data } from '@typings/command';
import { Event } from '@core/Event';
import { COLORS } from '@utilities/Constants';

// Export class
export class MarryComponentEvent extends Event {
  async run(interaction: ComponentInteraction, _id: string, data: Data): Promise<void> {
    const proposalData = (await this.client.redis.get(`marriage_request:${interaction.member!.id}`)) as string;
    if (proposalData) {
      await this.client.database.updateUser(interaction.member!.id, { lover: proposalData });
      await this.client.database.updateUser(proposalData, { lover: interaction.member!.id });
      await this.client.redis.del(`marriage_request:${interaction.member!.id}`);
    }

    return interaction.editParent({
      embed: {
        title: this.client.locale.translate(data.locale, proposalData ? 'economy.MARRIAGE' : 'global.ERROR'),
        description: this.client.locale.translate(data.locale, proposalData ? 'economy.marriage.SUCCESSFULLY_MARRIED' : 'economy.marriage.MARRIAGE_REQUEST_EXPIRED').replace('PROPOSER', proposalData),
        color: proposalData ? COLORS.GREEN : COLORS.RED
      },
      components: []
    });
  }
}
