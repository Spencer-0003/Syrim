/**
 * @file Help
 * @description Set Gender component callback
 * @author Spencer-0003
 */

// Import classes, constants & types
import type { ComponentInteraction } from 'eris';
import type { Data } from '@typings/command';
import { Constants } from 'eris';
import { Event } from '@core/Event';
import { COLORS } from '@utilities/Constants';

// Export class
export class SetGenderComponentEvent extends Event {
  async run(interaction: ComponentInteraction, id: string, data: Data): Promise<void> {
    const chosenGender = id.split('-')[1]?.split('.')[0];

    if (chosenGender) {
      await this.client.database.updateUser((interaction.user ?? interaction.member)!.id, { gender: chosenGender.charAt(0).toUpperCase() + chosenGender.slice(1) });
      return interaction.editParent({
        embeds: [
          {
            title: this.client.locale.translate(data.locale, 'global.SUCCESS'),
            description: this.client.locale.translate(data.locale, 'economy.SUCCESSFULLY_SET_GENDER'),
            color: COLORS.GREEN
          }
        ],
        components: []
      });
    }

    return interaction.editParent({
      embeds: [
        {
          title: this.client.locale.translate(data.locale, 'economy.SET_GENDER'),
          description: this.client.locale.translate(data.locale, 'economy.SET_GENDER_DESCRIPTION'),
          color: COLORS.GREEN
        }
      ],
      components: [
        {
          type: Constants.ComponentTypes.ACTION_ROW,
          components: [
            {
              type: Constants.ComponentTypes.BUTTON,
              style: 1,
              custom_id: `set_gender-male.${(interaction.member ?? interaction.user)!.id}`,
              label: this.client.locale.translate(data.locale, `economy.MALE`)
            },
            {
              type: Constants.ComponentTypes.BUTTON,
              style: 1,
              custom_id: `set_gender-female.${(interaction.member ?? interaction.user)!.id}`,
              label: this.client.locale.translate(data.locale, `economy.FEMALE`)
            },
            {
              type: Constants.ComponentTypes.BUTTON,
              style: 1,
              custom_id: `set_gender-undisclosed.${(interaction.member ?? interaction.user)!.id}`,
              label: this.client.locale.translate(data.locale, `economy.UNDISCLOSED`)
            }
          ]
        }
      ]
    });
  }
}
