/**
 * @file Database
 * @description Handles the database connection and queries
 * @author Spencer-0003
 * @todo Add Redis caching when https://github.com/Asjas/prisma-redis-middleware supports Node 17
 */

// Import classes & types
import type { BlacklistType, Command, Guild, User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

export class Database {
  // Properties
  private prisma: PrismaClient;
  redis: Redis;

  // Constructor
  constructor() {
    this.prisma = new PrismaClient();
    this.redis = new Redis(process.env.REDIS_URL);

    this.prisma.$use(async (params, next) => {
      if (params.model !== 'Blacklist' || params.action !== 'findUnique') return next(params);

      const key = params.args.where.id;
      const cached = await this.redis.get(`blacklist:${key}`);

      if (process.env.NODE_ENV === 'development') {
        console.log(`key: blacklist:${key}`);
        console.log(`Cached result: ${cached}`);
      }

      if (cached) return JSON.parse(cached);

      const res = (await next(params)) ?? {};
      await this.redis.set(`blacklist:${key}`, JSON.stringify(res), 'EX', 3600);

      return res;
    });
  }

  // Functions
  public getUserIfExists(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  public async getUser(id: string): Promise<User> {
    let user = await this.prisma.user.findUnique({ where: { id } });
    user ??= await this.prisma.user.create({ data: { id } });
    return user;
  }

  public async updateUser(id: string, data: Partial<User>): Promise<void> {
    await this.prisma.user.update({ where: { id }, data });
  }

  public async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  public async getGuild(id: string): Promise<Guild> {
    let guild = await this.prisma.guild.findUnique({ where: { id } });
    guild ??= await this.prisma.guild.create({ data: { id } });
    return guild;
  }

  public async updateGuild(id: string, data: Partial<Guild>): Promise<void> {
    await this.prisma.guild.update({ where: { id }, data });
  }

  public async createBlacklist(id: string, moderator: string, blacklistType: BlacklistType, reason: string): Promise<void> {
    await this.prisma.blacklist.create({ data: { id, moderator, type: blacklistType, reason } });
  }

  public async isBlacklisted(id: string): Promise<boolean> {
    return Object.keys((await this.prisma.blacklist.findUnique({ where: { id } }))!).length !== 0;
  }

  public async createCommand(guildId: string, commandId: string, response: string): Promise<void> {
    await this.prisma.command.create({ data: { guildId, commandId, response } });
  }

  public findCommand(commandId: string): Promise<Command | null> {
    return this.prisma.command.findUnique({ where: { commandId } });
  }

  public async deleteCommand(commandId: string): Promise<void> {
    await this.prisma.command.delete({ where: { commandId } });
  }
}
