/**
 * @file Eris
 * @description Extra typings for Eris
 * @typedef Eris
 */

// Import Eris
import 'eris';

// Add extra declarations
declare module 'eris' {
  interface Member {
    readonly tag: string;
  }

  interface User {
    readonly tag: string;
  }
}
