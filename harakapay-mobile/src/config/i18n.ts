import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import French translations
import frAuth from '../locales/fr/auth.json';
import frPayment from '../locales/fr/payment.json';
import frCommon from '../locales/fr/common.json';
import frDashboard from '../locales/fr/dashboard.json';
import frStudent from '../locales/fr/student.json';
import frNavigation from '../locales/fr/navigation.json';
import frProfile from '../locales/fr/profile.json';
import frNotifications from '../locales/fr/notifications.json';
import frMessages from '../locales/fr/messages.json';

// Import English translations
import enAuth from '../locales/en/auth.json';
import enPayment from '../locales/en/payment.json';
import enCommon from '../locales/en/common.json';
import enDashboard from '../locales/en/dashboard.json';
import enStudent from '../locales/en/student.json';
import enNavigation from '../locales/en/navigation.json';
import enProfile from '../locales/en/profile.json';
import enNotifications from '../locales/en/notifications.json';
import enMessages from '../locales/en/messages.json';

const LANGUAGE_KEY = '@harakapay:language';

// Configure i18n
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    fallbackLng: 'fr', // French as default
    lng: 'fr', // Initial language
    ns: ['auth', 'payment', 'common', 'dashboard', 'student', 'navigation', 'profile', 'notifications', 'messages'],
    defaultNS: 'common',
    resources: {
      fr: {
        auth: frAuth,
        payment: frPayment,
        common: frCommon,
        dashboard: frDashboard,
        student: frStudent,
        navigation: frNavigation,
        profile: frProfile,
        notifications: frNotifications,
        messages: frMessages,
      },
      en: {
        auth: enAuth,
        payment: enPayment,
        common: enCommon,
        dashboard: enDashboard,
        student: enStudent,
        navigation: enNavigation,
        profile: enProfile,
        notifications: enNotifications,
        messages: enMessages,
      },
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for React Native
    },
  });

/**
 * Initialize language from storage or system settings
 */
export const initializeLanguage = async (): Promise<void> => {
  try {
    // Try to get saved language preference
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

    if (savedLanguage) {
      // Use saved language
      await i18n.changeLanguage(savedLanguage);
      console.log('Loaded saved language:', savedLanguage);
    } else {
      // Detect system language
      const locales = getLocales();
      const systemLocale = locales && locales.length > 0 ? locales[0].languageCode : 'fr';
      const language = systemLocale === 'fr' || systemLocale === 'en' ? systemLocale : 'fr';

      await i18n.changeLanguage(language);
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
      console.log('Set language from system:', language);
    }
  } catch (error) {
    console.error('Error initializing language:', error);
    // Fall back to French
    await i18n.changeLanguage('fr');
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, 'fr');
    } catch (storageError) {
      console.error('Failed to save fallback language:', storageError);
    }
  }
};

/**
 * Change the app language and persist the choice
 */
export const changeLanguage = async (lang: string): Promise<void> => {
  try {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    console.log('Changed language to:', lang);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

/**
 * Get the current language
 */
export const getCurrentLanguage = (): string => {
  return i18n.language || 'fr';
};

export default i18n;
