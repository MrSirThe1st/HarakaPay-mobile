// Purpose: Complete color palette and brand colors

const colors = {
  // Brand & CTA
  primary: '#0080FF', // Main brand color - bright blue
  primaryDark: '#0066CC', // Darker blue for hover/pressed states
  primaryLight: '#3399FF', // Lighter blue for accents
  
  // Blue Shades Palette
  blue: {
    darkest: '#040A13', // Very dark blue - main background
    darker: '#0A1A2E', // Dark blue - secondary backgrounds
    dark: '#1E3A5F', // Medium dark blue - borders, dividers
    medium: '#2E5A8A', // Medium blue - subtle accents
    light: '#4A90E2', // Light blue - highlights
    lighter: '#87CEEB', // Sky blue - captions, inactive states
    lightest: '#E6F2FF', // Very light blue - cards, surfaces
    pale: '#F0F8FF', // Pale blue - subtle backgrounds
  },
  
  // States
  success: '#00C851', // Payment confirmations
  warning: '#FF8800', // Payment reminders
  error: '#FF4444',   // Failed transactions
  
  // Backgrounds & Surfaces
  background: '#040A13', // Very dark blue background
  backgroundSecondary: '#0A1A2E', // Slightly lighter dark blue
  surface: '#E6F2FF', // Light blue for cards
  cardBackground: '#0A1A2E', // Light blue for cards
  cardBackgroundAlt: '#F0F8FF', // Alternative card background (pale blue)
  
  // Text
  text: {
    primary: '#FFFFFF', // White text for dark background
    secondary: '#B0C4DE', // Light gray-blue for secondary text
    caption: '#87CEEB', // Sky blue for captions
    disabled: '#4A5568', // Dark gray for disabled text
    inverse: '#1D1D1F', // Dark text for light surfaces
    accent: '#4A90E2', // Light blue for accent text
  },
  
  // Borders & Dividers
  border: '#1E3A5F', // Dark blue-gray for borders
  borderLight: '#2E5A8A', // Lighter blue for subtle borders
  divider: '#1E3A5F', // Divider color
};

export default colors;
