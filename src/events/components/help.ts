/**
 * @file Help
 * @description Help component callback
 * @author Spencer-0003
 */

// Import classes, constants & types
import type { ActionRow, ComponentInteraction, EmbedField, TextChannel } from 'eris';
import type { Data } from '@typings/command';
import { Constants } from 'eris';
import { Event } from '@core/Event';
import { COLORS } from '@utilities/Constants';

// Export class
export class HelpComponentEvent extends Event {
  run(interaction: ComponentInteraction, id: string, data: Data): Promise<void> {
    const chosenCategory = id.split('-')[1].split('.')[0];
    const components = [{ type: Constants.ComponentTypes.ACTION_ROW, components: [] }] as ActionRow[];
    const fields: EmbedField[] = [];

    this.client.categories.forEach(category =>
      components[0].components.push({
        type: Constants.ComponentTypes.BUTTON,
        style: 1,
        disabled: chosenCategory === category,
        custom_id: `help-${category}.${(interaction.user ?? interaction.member)!.id}`,
        label: this.client.locale.translate(data.locale, `categories.${category.toUpperCase()}`)
      })
    );

    this.client.commands
      .filter(cmd => cmd.category === chosenCategory)
      .forEach(cmd => {
        fields.push({
          name: cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1),
          value: cmd.description,
          inline: false
        });
      });

    return interaction.editParent({
      embeds: [
        {
          title: chosenCategory === 'nsfw' ? 'NSFW' : chosenCategory.charAt(0).toUpperCase() + chosenCategory.slice(1),
          description: chosenCategory === 'nsfw' && !(interaction.channel as TextChannel).nsfw ? this.client.locale.translate(data.locale, 'misc.CHANNEL_NOT_NSFW') : this.client.locale.translate(data.locale, `category_descriptions.${chosenCategory.toUpperCase()}`),
          color: chosenCategory === 'nsfw' && !(interaction.channel as TextChannel).nsfw ? COLORS.RED : COLORS.GREEN,
          fields: chosenCategory === 'nsfw' && !(interaction.channel as TextChannel).nsfw ? [] : fields
        }
      ],
      components
    });
  }
}
