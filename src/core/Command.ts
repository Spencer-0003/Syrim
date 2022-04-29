/**
 * @file Command
 * @description Base class for commands
 * @author Spencer-0003
 */

// import types
import type { SyrimClient } from '@core/Client';
import type { Options, CommandContext, CommandOptions } from '@typings/command';
import type { PERMISSIONS } from '@utilities/Constants';
import { Constants } from 'eris';

// export class
export abstract class Command {
  // Properties
  client: SyrimClient;
  name: string;
  name_localizations?: Record<string, string>;
  description: string;
  description_localizations?: Record<string, string>;
  category: string;
  clientPermissions: PERMISSIONS[];
  guildOnly?: boolean;
  options?: Options[];
  ownerOnly?: boolean;
  voterOnly?: boolean;
  type = Constants.ApplicationCommandTypes.CHAT_INPUT | Constants.ApplicationCommandTypes.USER;
  default_member_permissions?: string;

  protected constructor(client: SyrimClient, options: CommandOptions) {
    this.client = client;
    this.name = options.name;
    this.name_localizations = options.name_localizations;
    this.description = options.description;
    this.description_localizations = options.description_localizations;
    this.category = options.category;
    this.clientPermissions = options.clientPermissions ?? ['viewChannel', 'sendMessages'];
    this.guildOnly = options.guildOnly;
    this.options = options.options;
    this.ownerOnly = options.ownerOnly;
    this.voterOnly = options.voterOnly;
    this.type = options.contextMenu ? Constants.ApplicationCommandTypes.USER : Constants.ApplicationCommandTypes.CHAT_INPUT;
    this.default_member_permissions = options.userPermissions;

    if (this.client.categories.indexOf(this.category) === -1) this.client.categories.push(this.category);
  }

  validate?(ctx: CommandContext): [boolean, string];
  abstract run(ctx: CommandContext): Promise<unknown> | unknown;
}
