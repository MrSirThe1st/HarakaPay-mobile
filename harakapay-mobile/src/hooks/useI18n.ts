import { useTranslation as useI18nTranslation } from 'react-i18next';
import { changeLanguage as changeAppLanguage } from '../config/i18n';

/**
 * Custom hook for i18n functionality
 * Wraps react-i18next's useTranslation with additional utilities
 *
 * @param namespace - The translation namespace to use (e.g., 'auth', 'payment')
 * @returns Translation utilities
 */
export const useI18n = (namespace?: string | string[]) => {
  const { t, i18n } = useI18nTranslation(namespace);

  return {
    /**
     * Translation function
     * @param key - The translation key (e.g., 'login.title')
     * @param options - Interpolation options
     */
    t,

    /**
     * Current active language code ('fr' or 'en')
     */
    currentLanguage: i18n.language,

    /**
     * Check if the current language is French
     */
    isFrench: i18n.language === 'fr',

    /**
     * Check if the current language is English
     */
    isEnglish: i18n.language === 'en',

    /**
     * Change the app language
     * @param lang - Language code ('fr' or 'en')
     */
    changeLanguage: async (lang: string) => {
      await changeAppLanguage(lang);
    },

    /**
     * Check if translations are ready
     */
    isReady: i18n.isInitialized,
  };
};

/**
 * Alias for useI18n for consistency with react-i18next
 */
export const useTranslation = useI18n;
