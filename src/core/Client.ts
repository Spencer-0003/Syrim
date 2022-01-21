/**
 * @file Client
 * @description Client that interacts with the Discord API
 * @author Spencer-0003
 */

// Import classes, functions & types
import type { Webhook } from 'eris';
import type { Callback } from '@typings/component';
import type { Command } from '@core/Command';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Client } from 'eris';
import { NekoBot } from 'nekobot-api';
import { Database } from '@core/Database';
import { Locale } from '@core/Locale';
import Redis from 'ioredis';

// Export client
export class SyrimClient extends Client {
  // Properties
  categories: string[];
  commands: Command[];
  componentCallbacks: { [key: string]: Callback };
  database: Database;
  locale: Locale;
  nekoBot: NekoBot;
  redis: Redis.Redis;

  // Constructor
  constructor(token: string) {
    super(`Bot ${token}`, {
      compress: true,
      restMode: true,
      maxShards: 'auto',
      disableEvents: { TYPING_START: true },
      messageLimit: 10,
      intents: ['directMessageReactions', 'directMessages', 'guildBans', 'guildMembers', 'guildMessageReactions', 'guildMessages', 'guildPresences', 'guildVoiceStates', 'guilds']
    });

    this.categories = [];
    this.commands = [];
    this.componentCallbacks = {};

    this.database = new Database();
    this.locale = new Locale(join(__dirname, '../locales'));
    this.nekoBot = new NekoBot(process.env.NEKOBOT_API_KEY);
    this.redis = new Redis(process.env.REDIS_URL);
  }

  // Getters
  get version(): string {
    return process.env.npm_package_version;
  }

  // Methods
  private _loadCommands(dir: string): void {
    readdirSync(dir, { withFileTypes: true }).forEach(async file => {
      if (file.isDirectory()) return this._loadCommands(`${dir}/${file.name}`);

      try {
        const importedCommand = await import(join(dir, file.name));
        const commandClass = importedCommand[Object.keys(importedCommand)[0]];
        const cmd = new commandClass(this);

        this.commands.push(cmd);
      } catch {
        throw new Error(`Failed to load command: '${file.name}'`);
      }
    });
  }

  private _loadEvents(dir: string, isComponent = false): void {
    readdirSync(dir, { withFileTypes: true }).forEach(async file => {
      try {
        if (!isComponent && file.name === 'components') return;
        const importedEvent = await import(join(dir, file.name));
        const eventClass = importedEvent[Object.keys(importedEvent)[0]];
        const loadedEvent = new eventClass(this);
        const fileName = file.name.split('.').slice(0, -1).join('.');

        if (isComponent) this.componentCallbacks[fileName] = loadedEvent.run.bind(loadedEvent);
        else this[fileName === 'ready' ? 'once' : 'on'](fileName, loadedEvent.run.bind(loadedEvent));
      } catch {
        throw new Error(`Failed to load ${isComponent ? 'component' : 'event'}: '${file.name}'`);
      }
    });
  }

  public async getOrCreateWebhook(channelId: string): Promise<Webhook> {
    const webhooks = await this.getChannelWebhooks(channelId);
    let webhook = webhooks.find(webhook => webhook.name === this.user.username);
    webhook ??= await this.createChannelWebhook(channelId, {
      name: this.user.username,
      avatar: this.user.avatarURL
    });

    if (!webhook.token) {
      await this.deleteWebhook(webhook.id);
      webhook = await this.createChannelWebhook(channelId, {
        name: this.user.username,
        avatar: this.user.avatarURL
      });
    }

    return webhook;
  }

  public launch(): void {
    this._loadCommands(join(__dirname, '../commands'));
    this._loadEvents(join(__dirname, '../events'));
    this._loadEvents(join(__dirname, '../events/components'), true);
    void this.connect();
  }
}
