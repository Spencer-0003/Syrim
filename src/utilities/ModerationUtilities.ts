/**
 * @file ModerationUtilities
 * @description Utilities for moderation
 * @author Spencer-0003
 */

// Import types
import type { Member, Role } from 'eris';

// Misc functions
const getTopRole = (member: Member): Role | Partial<Role> => {
  return member.roles.map(r => member.guild.roles.get(r)!).sort((a, b) => b.position - a.position)[0] ?? { position: -1 };
};

// Export functions
export const isSuperior = (memberOne: Member, memberTwo: Member): boolean => {
  const ownerId = memberOne.guild.ownerID;
  return (ownerId === memberOne.id && ownerId !== memberTwo.id) || getTopRole(memberOne).position! > getTopRole(memberTwo).position!;
};
