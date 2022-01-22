/**
 * @file Constants
 * @description Eris constants
 * @author Spencer-0003
 */

// Import Eris Constants & execSync
import { Constants } from 'eris';
import { execSync } from 'child_process';

// Discord Constants
export const COLORS: { [key: string]: number } = {
  RED: 0xff0000,
  GREEN: 0x00ff00,
  LIGHT_BLUE: 0x00ffff
};

export type PERMISSIONS = Exclude<keyof typeof Constants['Permissions'], ['viewAuditLogs', 'stream', 'readMessages', 'externalEmojis', 'manageEmojis', 'useSlashCommands']>;

// Git Constants
export const commitHash = (() => {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim().slice(0, 8);
  } catch {
    return 'GIT_NOT_INSTALLED';
  }
})();