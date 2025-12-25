import i18n from '../config/i18n';

/**
 * Format currency amount according to current language
 * @param amount - The numeric amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date according to current language
 * @param date - Date string or Date object
 * @param options - Optional Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(dateObj);
};

/**
 * Format date and time according to current language
 * @param date - Date string or Date object
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: string | Date): string => {
  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Format time according to current language
 * @param date - Date string or Date object
 * @returns Formatted time string
 */
export const formatTime = (date: string | Date): string => {
  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Format number according to current language
 * @param value - The numeric value to format
 * @param options - Optional Intl.NumberFormatOptions
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number,
  options?: Intl.NumberFormatOptions
): string => {
  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  return new Intl.NumberFormat(locale, options).format(value);
};
