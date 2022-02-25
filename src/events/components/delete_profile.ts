/**
 * @file Delete profile
 * @description Delete Profile component callback
 * @author Spencer-0003
 */

// Import classes, constants & types
import type { ComponentInteraction } from 'eris';
import type { Data } from '@typings/command';
import { Constants } from 'eris';
import { Event } from '@core/Event';
import { COLORS } from '@utilities/Constants';

// Export class
export class DeleteProfileComponentEvent extends Event {
  async run(interaction: ComponentInteraction, id: string, data: Data): Promise<void> {
    const confirmed = id.split('-')[1]?.split('.')[0];

    if (confirmed) {
      await this.client.database.deleteUser((interaction.user ?? interaction.member)!.id);
      return interaction.editParent({
        embed: {
          title: this.client.locale.translate(data.locale, 'global.SUCCESS'),
          description: this.client.locale.translate(data.locale, 'economy.SUCCESSFULLY_DELETED_PROFILE'),
          color: COLORS.GREEN
        },
        components: []
      });
    }

    return interaction.editParent({
      embed: {
        title: this.client.locale.translate(data.locale, 'economy.DELETE_PROFILE'),
        description: this.client.locale.translate(data.locale, 'economy.DELETE_PROFILE_DESCRIPTION'),
        color: COLORS.GREEN
      },
      components: [
        {
          type: Constants.ComponentTypes.ACTION_ROW,
          components: [
            {
              type: Constants.ComponentTypes.BUTTON,
              style: Constants.ButtonStyles.DANGER,
              custom_id: `delete_profile-confirm.${(interaction.member ?? interaction.user)!.id}`,
              label: this.client.locale.translate(data.locale, `global.CONFIRM`)
            }
          ]
        }
      ]
    });
  }
}
