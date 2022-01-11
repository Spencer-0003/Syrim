/**
 * @file ErisPatch
 * @description Patch member & user prototypes
 */

// Import Eris
import { Member, User } from 'eris';

// Patch prototypes
Object.defineProperties(User.prototype, {
  tag: {
    get(this: User) {
      return `${this.username}#${this.discriminator}`;
    }
  }
});

Object.defineProperties(Member.prototype, {
  tag: {
    get(this: Member) {
      return this.user.tag;
    }
  }
});
