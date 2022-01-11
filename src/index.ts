/**
 * @file Index
 * @description Create an instance of Syrim
 * @author Spencer-0003
 */

import 'module-alias/register';
import 'dotenv/config';
import '@utilities/ErisPatch';
import { SyrimClient } from '@core/Client';

void new SyrimClient(process.env.DISCORD_TOKEN).launch();
