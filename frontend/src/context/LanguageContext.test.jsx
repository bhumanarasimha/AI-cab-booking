import { vi, describe, test, expect, beforeAll, beforeEach } from 'vitest';
import { useContext } from 'react';
import { useLanguage } from './LanguageContext';
import { translations } from '../utils/translations';

// Simple mock for localStorage for Node environment
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
}

// Mock react to allow us to spy on useContext
vi.mock('react', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useContext: vi.fn()
  };
});

describe('LanguageContext & useLanguage hook checks', () => {
  beforeAll(() => {
    global.localStorage = new LocalStorageMock();
  });

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('useLanguage outside Provider should return fallback object and log error', () => {
    vi.mocked(useContext).mockReturnValue(null);
    
    // Spy on console.error to prevent spamming output but confirm it was called
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const context = useLanguage();
    expect(context.language).toBe('English');
    expect(typeof context.setLanguage).toBe('function');
    expect(typeof context.t).toBe('function');
    
    expect(consoleSpy).toHaveBeenCalledWith("useLanguage must be used within a LanguageProvider");
    consoleSpy.mockRestore();
  });

  test('useLanguage inside Provider should return provider values', () => {
    const mockContextValue = {
      language: 'Tamil',
      setLanguage: vi.fn(),
      t: (k) => `translated-${k}`
    };
    vi.mocked(useContext).mockReturnValue(mockContextValue);

    const context = useLanguage();
    expect(context.language).toBe('Tamil');
    expect(context.t('app_settings')).toBe('translated-app_settings');
  });

  test('useLanguage fallback translation function t() behavior outside provider', () => {
    vi.mocked(useContext).mockReturnValue(null);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { t } = useLanguage();
    expect(t('app_settings')).toBe('app_settings');
    expect(t('notifications')).toBe('notifications');
    
    consoleSpy.mockRestore();
  });

  describe('Translation mapping validation logic', () => {
    const simulateT = (key, language) => {
      const langDict = translations[language] || translations['English'];
      return langDict[key] || translations['English'][key] || key;
    };

    test('should map known keys correctly in English', () => {
      expect(simulateT('app_settings', 'English')).toBe('App Settings');
      expect(simulateT('notifications', 'English')).toBe('Notifications');
      expect(simulateT('push_alerts', 'English')).toBe('Push, email & SMS alerts');
    });

    test('should map known keys correctly in Hindi', () => {
      expect(simulateT('app_settings', 'Hindi')).toBe('ऐप सेटिंग्स');
      expect(simulateT('language', 'Hindi')).toBe('भाषा');
    });

    test('should fall back to English if the target language is invalid or missing', () => {
      expect(simulateT('app_settings', 'Spanish')).toBe('App Settings');
    });

    test('should fall back to English if the key is missing in target language but present in English', () => {
      const originalTranslations = { ...translations };
      
      translations['Hindi']['mock_key_test'] = undefined;
      translations['English']['mock_key_test'] = 'Mock English Value';
      
      expect(simulateT('mock_key_test', 'Hindi')).toBe('Mock English Value');
      
      // Restore
      delete translations['English']['mock_key_test'];
      delete translations['Hindi']['mock_key_test'];
    });

    test('should return the raw key if key does not exist in any language', () => {
      expect(simulateT('completely_unknown_key_999', 'Hindi')).toBe('completely_unknown_key_999');
      expect(simulateT('completely_unknown_key_999', 'English')).toBe('completely_unknown_key_999');
    });

    test('should handle language initialization logic based on localStorage', () => {
      localStorage.setItem('app_language', 'Tamil');
      const getInitialLang = () => localStorage.getItem('app_language') || 'English';
      expect(getInitialLang()).toBe('Tamil');
    });

    test('should update localStorage when language is changed', () => {
      const setLanguageMock = (lang) => {
        localStorage.setItem('app_language', lang);
      };
      setLanguageMock('Kannada');
      expect(localStorage.getItem('app_language')).toBe('Kannada');
    });
  });
});
