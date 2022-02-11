/**
 * @file Command Typings
 * @description Typings for commands
 * @typedef command
 */

// Import types
import type { CommandInteraction, Role, User, PartialChannel } from 'eris';
import type { Guild, Profile } from '@prisma/client';
import type { PERMISSIONS } from '@utilities/Constants';
import { Constants } from 'eris';

// Export interfaces
export interface Data {
  guild?: Guild;
  locale: string;
  profile: Profile;
}

export interface Options {
  name: string;
  description: string;
  choices?: { name: string; value: string | number | boolean }[];
  required?: boolean;
  type: Constants.ApplicationCommandOptionTypes.STRING | Constants.ApplicationCommandOptionTypes.INTEGER | Constants.ApplicationCommandOptionTypes.BOOLEAN | Constants.ApplicationCommandOptionTypes.USER | Constants.ApplicationCommandOptionTypes.CHANNEL;
}

export interface CommandOptions {
  name: string;
  description: string;
  category: string;
  clientPermissions?: PERMISSIONS[];
  contextMenu?: boolean;
  guildOnly?: boolean;
  options?: Options[];
  ownerOnly?: boolean;
  voterOnly?: boolean;
  userPermissions?: PERMISSIONS[];
}

export interface CommandContext {
  interaction: CommandInteraction;
  args: Record<string, string | boolean | number | Role | User | PartialChannel>;
  data: Data;
}