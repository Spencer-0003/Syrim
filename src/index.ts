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

init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV, attachStacktrace: true });
configureScope(scope => scope.setTags({ 'syrim.commitHash': commitHash }));

void new SyrimClient(process.env.DISCORD_TOKEN).launch();
