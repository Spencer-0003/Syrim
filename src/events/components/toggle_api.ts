/**
 * @file Toggle API
 * @description Toggle API component callback
 * @author Spencer-0003
 */

// Import classes, constants & types
import type { ComponentInteraction } from 'eris';
import type { Data } from '@typings/command';
import { Event } from '@core/Event';
import { COLORS } from '@utilities/Constants';

// Export class
export class ToggleAPIComponentEvent extends Event {
  async run(interaction: ComponentInteraction, _id: string, data: Data): Promise<void> {
    const newVisiblity = !data.profile.visibleInAPI;

    await this.client.database.updateUser(data.profile.id, { visibleInAPI: newVisiblity })
    return interaction.editParent({
      embed: {
        title: this.client.locale.translate(data.locale, 'economy.TOGGLE_API'),
        description: this.client.locale.translate(data.locale, newVisiblity ? 'economy.ENABLED_API' : 'economy.DISABLED_API'),
        color: COLORS.GREEN
      },
      components: []
    });
  }
}
