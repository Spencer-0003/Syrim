/**
 * @file SetAttribute
 * @description Set an attribute in the API
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { Message } from 'eris';
import type { SyrimClient } from '@core/Client';
import type { CommandContext } from '@typings/command';
import { Constants } from 'eris';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

export class SetAttribute extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'setattribute',
      description: 'Set an attribute in the API.',
      category: 'economy',
      options: [
        {
          name: 'key',
          description: 'The attribute key.',
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: true
        },
        {
          name: 'value',
          description: 'The attribute value.',
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: true
        }
      ]
    });
  }

  validate({ args, data }: CommandContext): [boolean, string] {
    return [/^[\w-]{1,32}$/.test(args.key as string), this.client.locale.translate(data.locale, 'economy.INVALID_KEY_NAME')];
  }

  async run({ interaction, args, data }: CommandContext): Promise<Message> {
    const attributes = JSON.parse(data.profile.attributes);

    if (attributes.length === 5 && !attributes[args.key as string] && data.profile.reputation === 'USER')
      return interaction.createFollowup({
        embed: {
          title: this.client.locale.translate(data.locale, 'global.ERROR'),
          description: this.client.locale.translate(data.locale, 'economy.MAXIMUM_ATTRIBUTES'),
          color: COLORS.RED
        }
      });

    attributes[args.key as string] = args.value as string;
    await this.client.database.updateUser(data.profile.id, { attributes: JSON.stringify(attributes) });

    return interaction.createFollowup({
      embed: {
        title: this.client.locale.translate(data.locale, 'global.SUCCESS'),
        description: this.client.locale.translate(data.locale, 'economy.ATTRIBUTE_SET'),
        color: COLORS.GREEN
      }
    });
  }
}
