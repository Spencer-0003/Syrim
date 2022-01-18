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

      const locale = JSON.parse(readFileSync(`${dir}/${file.name}`, 'utf8'));
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resolvedLocale: Record<string, any> = {};

      Object.entries(locale).forEach(translation => {
        if (typeof translation[1] === 'object') {
          resolvedLocale[translation[0]] = {};
          Object.entries(translation[1] as Record<string, string>).forEach(str => {
            if (str[1].length > 0) resolvedLocale[translation[0]][str[0]] = str[1];
          });
        } else resolvedLocale[translation[0]] = translation[1];
      });

      this.locales[file.name.split('.').slice(0, -1).join('.')] = resolvedLocale;
    });
  }

  public translate(locale: string, field: string): string {
    const category = field.indexOf('.') > -1 && field.split('.')[0];
    if (!this.locales[locale]) locale = 'en-US';
    if (!category) return (this.locales[locale][field] as unknown as string) ?? 'TRANSLATION_NOT_FOUND';
    return this.locales[locale][category][field.split('.')[1]] ?? 'TRANSLATION_NOT_FOUND';
  }
}
