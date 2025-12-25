// Purpose: Complete color palette and brand colors

const colors = {
  // Brand & CTA
  primary: '#3B82F6', // Main brand color - light blue
  primaryDark: '#2563EB', // Darker blue for hover/pressed states
  primaryLight: '#60A5FA', // Lighter blue for accents

  // Accent Color
  accent: '#10B981', // Emerald green - for icons, small buttons, success states
  accentDark: '#059669', // Darker green for hover/pressed states
  accentLight: '#34D399', // Lighter green for subtle accents

  // Blue Shades Palette
  blue: {
    darkest: '#1E3A8A', // Deep blue - for headers/footers
    darker: '#1E40AF', // Dark blue - secondary backgrounds
    dark: '#2563EB', // Medium dark blue - borders, dividers
    medium: '#3B82F6', // Medium blue - primary color
    light: '#60A5FA', // Light blue - highlights
    lighter: '#93C5FD', // Sky blue - captions, inactive states
    lightest: '#DBEAFE', // Very light blue - cards, surfaces
    pale: '#EFF6FF', // Pale blue - subtle backgrounds
  },

  // States
  success: '#10B981', // Payment confirmations (emerald green)
  warning: '#F59E0B', // Payment reminders (amber)
  error: '#EF4444',   // Failed transactions (red)
  info: '#3B82F6',    // Information (light blue)

  // Backgrounds & Surfaces
  background: '#FFFFFF', // White background
  backgroundSecondary: '#F9FAFB', // Very light gray
  surface: '#FFFFFF', // White for cards
  cardBackground: '#FFFFFF', // White for cards
  cardBackgroundAlt: '#F3F4F6', // Light gray alternative

  // Text
  text: {
    primary: '#111827', // Dark gray for main text
    secondary: '#6B7280', // Medium gray for secondary text
    caption: '#9CA3AF', // Light gray for captions
    disabled: '#D1D5DB', // Very light gray for disabled text
    inverse: '#FFFFFF', // White text for dark backgrounds
    accent: '#3B82F6', // Light blue for accent text
  },

  // Borders & Dividers
  border: '#E5E7EB', // Light gray for borders
  borderLight: '#F3F4F6', // Very light gray for subtle borders
  divider: '#E5E7EB', // Divider color

  // Grays
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

export default colors;
