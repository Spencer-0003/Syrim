/**
 * @file Set Bio
 * @description Set Bio component callback
 * @author Spencer-0003
 */

// Import classes, constants & types
import type { ComponentInteraction, ModalSubmitInteraction } from 'eris';
import type { Data } from '@typings/command';
import { Constants } from 'eris';
import { Event } from '@core/Event';
import { COLORS } from '@utilities/Constants';

// Export class
export class SetBioComponentEvent extends Event {
  async run(interaction: ComponentInteraction, id: string, data: Data): Promise<void> {
    const interactionType = id.split('-')[1]?.split('.')[0];

    if (interactionType === 'component')
      return interaction.createModal({
        title: this.client.locale.translate(data.locale, 'economy.SET_BIO'),
        custom_id: `set_bio-modal.${(interaction.member ?? interaction.user)!.id}`,
        components: [
          {
            type: Constants.ComponentTypes.ACTION_ROW,
            components: [
              {
                type: Constants.ComponentTypes.TEXT_INPUT,
                style: Constants.TextInputStyles.SHORT,
                label: this.client.locale.translate(data.locale, 'economy.BIO_MODAL_TITLE'),
                custom_id: `${(interaction.member ?? interaction.user)!.id}'s-bio`,
                required: true
              }
            ]
          }
        ]
      });
    
    await this.client.database.updateUser((interaction.member ?? interaction.user)!.id, { bio: (interaction as unknown as ModalSubmitInteraction).data.components[0].components[0].value as string });
    return interaction.createMessage({
      embed: {
        title: this.client.locale.translate(data.locale, 'global.SUCCESS'),
        description: this.client.locale.translate(data.locale, 'economy.SUCCESSFULLY_SET_BIO'),
        color: COLORS.GREEN
      }
    });
  }
}
