/**
 * @file ModerationUtilities
 * @description Utilities for moderation
 * @author Spencer-0003
 */

// Import types
import type { Member, Role } from 'eris';

// Misc functions
const getTopRole = (member: Member): Role | undefined => {
  return member.roles.map(r => member.guild.roles.get(r)).sort((a, b) => b!.position - a!.position)[0];
};

// Export functions
export const isSuperior = (memberOne: Member, memberTwo: Member): boolean => {
  return (getTopRole(memberOne)?.position ?? -1) > (getTopRole(memberTwo)?.position ?? -1);
};
