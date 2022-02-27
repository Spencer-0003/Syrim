/**
 * @file Set Birthday
 * @description Set Birthday component callback
 * @author Spencer-0003
 */

// Import classes, constants & types
import type { ComponentInteraction, ModalSubmitInteraction } from 'eris';
import type { Data } from '@typings/command';
import { Constants } from 'eris';
import { Event } from '@core/Event';
import { COLORS } from '@utilities/Constants';

// Export class
export class SetBirthdayComponentEvent extends Event {
  async run(interaction: ComponentInteraction, id: string, data: Data): Promise<void> {
    const interactionType = id.split('-')[1]?.split('.')[0];

    if (interactionType === 'component')
      return interaction.createModal({
        title: this.client.locale.translate(data.locale, 'economy.SET_BIRTHDAY'),
        custom_id: `set_birthday-modal.${(interaction.member ?? interaction.user)!.id}`,
        components: [
          {
            type: Constants.ComponentTypes.ACTION_ROW,
            components: [
              {
                type: Constants.ComponentTypes.TEXT_INPUT,
                style: Constants.TextInputStyles.SHORT,
                label: this.client.locale.translate(data.locale, 'economy.BIRTHDAY_MODAL_TITLE'),
                custom_id: `${(interaction.member ?? interaction.user)!.id}'s-birthday`,
                placeholder: data.profile.birthday ?? this.client.locale.translate(data.locale, 'economy.UNDISCLOSED')
              }
            ]
          }
        ]
      });

    const sanitizedBirthday = (interaction as unknown as ModalSubmitInteraction).data.components[0].components[0].value.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1').substring(0, 10); // 'If it was hard to write, it should be hard to read.'
    if (sanitizedBirthday.length < 10 || sanitizedBirthday.indexOf('*') > -1)
      return interaction.editParent({
        embed: {
          title: this.client.locale.translate(data.locale, 'global.ERROR'),
          description: this.client.locale.translate(data.locale, 'economy.INVALID_BIRTHDAY'),
          color: COLORS.RED
        }
      });

    await this.client.database.updateUser((interaction.member ?? interaction.user)!.id, { birthday: new Date(sanitizedBirthday) });
    return interaction.editParent({
      embed: {
        title: this.client.locale.translate(data.locale, 'global.SUCCESS'),
        description: this.client.locale.translate(data.locale, 'economy.SUCCESSFULLY_SET_BIRTHDAY'),
        color: COLORS.GREEN
      }
    });
  }
}
