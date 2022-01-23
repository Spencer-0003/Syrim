/**
 * @file Database
 * @description Handles the database connection and queries
 * @author Spencer-0003
 */

// Import classes & types
import type { Blacklist, Guild, User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

export class Database {
  // Properties
  private prisma: PrismaClient;

  // Constructor
  constructor() {
    this.prisma = new PrismaClient();
  }

  // Functions
  public async getUserIfExists(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  public async getUser(id: string): Promise<User> {
    let user = await this.prisma.user.findUnique({ where: { id } });
    user ??= await this.prisma.user.create({ data: { id } });

    this.prisma.$disconnect();
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

    this.prisma.$disconnect();
    return guild;
  }

  public async updateGuild(id: string, data: Partial<Guild>): Promise<void> {
    await this.prisma.guild.update({ where: { id }, data });
  }

  public async createBlacklist(id: string, moderator: string, blacklistType: 'GUILD' | 'USER', reason: string): Promise<void> {
    await this.prisma.blacklist.create({ data: { id, moderator, type: blacklistType, reason } });
  }

  public async getBlacklist(id: string): Promise<Blacklist | null> {
    return this.prisma.blacklist.findUnique({ where: { id } });
  }
}
