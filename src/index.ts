/**
 * @file Index
 * @description Create an instance of Syrim
 * @author Spencer-0003
 */

import 'module-alias/register';
import 'dotenv/config';
import '@utilities/ErisPatch';
import { configureScope, init } from '@sentry/node';
import { SyrimClient } from '@core/Client';
import { commitHash } from '@utilities/Constants';

if (process.env.SENTRY_DSN) {
  init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV, attachStacktrace: true });
  configureScope(scope => scope.setTags({ 'syrim.commitHash': commitHash }));
} else console.warn('Sentry DSN not found, no error reporting will be sent.');

void new SyrimClient(process.env.DISCORD_TOKEN).launch();
