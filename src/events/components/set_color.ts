/**
 * @file Set Color
 * @description Set Color component callback
 * @author Spencer-0003
 */

// Import classes, constants & types
import type { ActionRow, ComponentInteraction } from 'eris';
import type { Data } from '@typings/command';
import { Constants } from 'eris';
import { Event } from '@core/Event';
import { COLORS } from '@utilities/Constants';

// Export class
export class SetColorComponentEvent extends Event {
  async run(interaction: ComponentInteraction, id: string, data: Data): Promise<void> {
    const chosenColor = id.split('-')[1]?.split('.')[0];

    if (chosenColor) {
      await this.client.database.updateUser((interaction.user ?? interaction.member)!.id, { color: chosenColor });
      return interaction.editParent({
        embeds: [
          {
            title: this.client.locale.translate(data.locale, 'global.SUCCESS'),
            description: this.client.locale.translate(data.locale, 'economy.SUCCESSFULLY_SET_COLOR'),
            color: COLORS.GREEN
          }
        ],
        components: []
      });
    }

    const components: ActionRow[] = [{ type: Constants.ComponentTypes.ACTION_ROW, components: [] }];
    Object.keys(COLORS).forEach(color => {
      components[0].components.push({
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.PRIMARY,
        disabled: data.profile.color === color,
        custom_id: `set_color-${color}.${(interaction.member ?? interaction.user)!.id}`,
        label: color.charAt(0) + color.slice(1).toLowerCase().replace('_', ' ')
      });
    });

    return interaction.editParent({
      embeds: [
        {
          title: this.client.locale.translate(data.locale, 'economy.SET_COLOR'),
          description: this.client.locale.translate(data.locale, 'economy.SET_COLOR_DESCRIPTION'),
          color: COLORS.GREEN
        }
      ],
      components
    });
  }
}
