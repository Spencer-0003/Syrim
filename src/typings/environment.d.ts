/**
 * @file Environment variables
 * @description Typings for environment variables
 * @typedef ProcessEnv
 */

declare namespace NodeJS {
  export interface ProcessEnv {
    BOT_FARM_LOGS: string;
    DATABASE_URL: string;
    DEVELOPMENT_GUILD: string;
    DEVELOPMENT_LOGS: string;
    DISCORD_TOKEN: string;
    ERROR_LOGS: string;
    JOINED_GUILD_LOGS: string;
    LEFT_GUILD_LOGS: string;
    LOG_LOCALE: string;
    NODE_ENV: string;
    NEKOBOT_API_KEY: string;
    npm_package_version: string;
    OWNER_ID: string;
    REDIS_URL: string;
    SENTRY_DSN: string;
    STATCORD_API_KEY: string;
  }
}
