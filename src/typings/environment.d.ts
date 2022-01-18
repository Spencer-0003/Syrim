/**
 * @file Environment variables
 * @description Typings for environment variables
 * @typedef ProcessEnv
 */

declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    DEVELOPMENT_GUILD: string;
    DISCORD_TOKEN: string;
    NODE_ENV: string;
    NEKOBOT_API_KEY: string;
    npm_package_version: string;
    SENTRY_DSN: string;
    STATCORD_API_KEY: string;
  }
}
