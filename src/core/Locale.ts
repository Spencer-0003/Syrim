/**
 * @file Locale
 * @description Handles localization
 * @author Spencer-0003
 */

// Import types and functions
import { readdirSync, readFileSync } from 'fs';

// Export class
export class Locale {
  // Internal properties
  readonly locales: { [key: string]: { [key: string]: Record<string, string> } };

  // Constructor
  constructor(dir: string) {
    this.locales = {};
    this._updateLocales(dir);
  }

  // Functions & Methods
  private _updateLocales(dir: string): void {
    readdirSync(dir, { withFileTypes: true }).forEach(file => {
      if (file.isDirectory()) return this._updateLocales(`${dir}/${file.name}`);
      this.locales[file.name.split('.').slice(0, -1).join('.')] = JSON.parse(readFileSync(`${dir}/${file.name}`, 'utf8'));
    });
  }

  public translate(locale: string, field: string): string {
    if (!this.locales[locale]) locale = 'en-US';
    if (field.indexOf('.') > -1) {
      let translated = this.locales[locale];
      field.split('.').forEach(subField => ((translated as unknown) = translated[subField]));
      return (translated as unknown as string) ?? 'TRANSLATION_NOT_FOUND';
    }
    return (this.locales[locale][field] as unknown as string) ?? 'TRANSLATION_NOT_FOUND';
  }
}
