// Purpose: Typography system with consistent text styling

const fonts = {
  family: {
    primary: 'IBM Plex Sans',
    // fallback: 'System', // Add fallback if needed
  },
  size: {
    h1: 24,      // Page titles
    h2: 20,      // Section headers
    body: 16,    // Primary content
    caption: 14, // Secondary information
  },
  weight: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
};

export default fonts;
