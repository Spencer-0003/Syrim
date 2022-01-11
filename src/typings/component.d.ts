/**
 * @file Component
 * @description Typings for component callbacks
 * @typedef componentCallback
 */

// Import types
import type { ComponentInteraction } from 'eris';
import type { Data } from '@typings/command';

// Export types
export type Callback = (interaction: ComponentInteraction, id: string, data: Data) => Promise<unknown> | unknown;
