/**
 * @file DeleteAttribute
 * @description Delete an attribute from the API
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { SyrimClient } from '@core/Client';
import type { CommandContext } from '@typings/command';
import { Constants } from 'eris';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

export class DeleteAttribute extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'deleteattribute',
      description: 'Delete an attribute from the API.',
      category: 'economy',
      options: [
        {
          name: 'key',
          description: 'The attribute key.',
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: true
        }
      ]
    });
  }
  async run({ interaction, args, data }: CommandContext): Promise<void> {
    const attributes = JSON.parse(data.profile.attributes);
    let deleted = false;

    if (attributes[args.key as string]) {
      deleted = true;
      delete attributes[args.key as string];
      await this.client.database.updateUser(data.profile.id, { attributes: JSON.stringify(attributes) });
    }

    return interaction.createMessage({
      embed: {
        title: this.client.locale.translate(data.locale, deleted ? 'global.SUCCESS' : 'global.ERROR'),
        description: this.client.locale.translate(data.locale, deleted ? 'economy.ATTRIBUTE_DELETED' : 'economy.ATTRIBUTE_NOT_FOUND'),
        color: deleted ? COLORS.GREEN : COLORS.RED
      }
    });
  }
}
