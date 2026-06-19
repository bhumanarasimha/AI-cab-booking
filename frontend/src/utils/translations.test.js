import { describe, test, expect } from 'vitest';
import { translations } from './translations';

const languages = Object.keys(translations);
const expectedKeys = Object.keys(translations['English']);

describe('Translations Registry Coverage', () => {
  test('should support all 8 target languages', () => {
    expect(languages).toHaveLength(8);
    expect(languages).toEqual([
      'English',
      'Hindi',
      'Kannada',
      'Tamil',
      'Telugu',
      'Malayalam',
      'Bengali',
      'Marathi'
    ]);
  });

  // Test set 1: Presence and types of translations (200 test cases)
  languages.forEach((lang) => {
    describe(`Language presence: ${lang}`, () => {
      expectedKeys.forEach((key) => {
        test(`should have valid non-empty translation for key: "${key}"`, () => {
          const dict = translations[lang];
          expect(dict).toBeDefined();
          
          const value = dict[key];
          expect(value).toBeDefined();
          expect(typeof value).toBe('string');
          expect(value.trim()).not.toBe('');
        });
      });
    });
  });

  // Test set 2: Whitespace integrity checking to prevent UI rendering issues (200 test cases)
  languages.forEach((lang) => {
    describe(`Language formatting: ${lang}`, () => {
      expectedKeys.forEach((key) => {
        test(`translation for "${key}" should not have leading/trailing whitespace`, () => {
          const dict = translations[lang];
          const value = dict[key];
          expect(value).toBe(value.trim());
        });
      });
    });
  });
});
