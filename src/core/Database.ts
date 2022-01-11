/**
 * @file Database
 * @description Handles the database connection and queries
 * @author Spencer-0003
 */

// Import classes & types
import type { Guild, User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

export class Database {
  // Properties
  private prisma: PrismaClient;

  // Constructor
  constructor() {
    this.prisma = new PrismaClient();
  }

  // Functions
  public async getUser(id: string): Promise<User> {
    let user = await this.prisma.user.findUnique({ where: { discordId: id } });
    user ??= await this.prisma.user.create({ data: { discordId: id } });

    this.prisma.$disconnect();
    return user;
  }

  public async getGuild(id: string): Promise<Guild> {
    let guild = await this.prisma.guild.findUnique({ where: { guildId: id } });
    guild ??= await this.prisma.guild.create({ data: { guildId: id } });

    this.prisma.$disconnect();
    return guild;
  }
}
