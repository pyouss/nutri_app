'use client'

import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// Theme configuration
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// Color palette based on UX Design Specification
const colors = {
  // Primary colors - Teal/Cyan for fresh, modern, health-associated feel
  primary: {
    50: '#E6FFFA',
    100: '#B2F5EA',
    200: '#81E6D9',
    300: '#4FD1C7',
    400: '#38B2AC',
    500: '#00B4A6', // Primary brand color
    600: '#008B7D',
    700: '#006B5F',
    800: '#004D44',
    900: '#002E29',
  },
  // Secondary colors - Warm coral for visual interest
  secondary: {
    50: '#FFF5F5',
    100: '#FED7D7',
    200: '#FEB2B2',
    300: '#FC8181',
    400: '#F56565',
    500: '#FF6B6B', // Secondary brand color
    600: '#E53E3E',
    700: '#C53030',
    800: '#9B2C2C',
    900: '#742A2A',
  },
  // Semantic colors
  success: {
    50: '#F0FFF4',
    100: '#C6F6D5',
    200: '#9AE6B4',
    300: '#68D391',
    400: '#48BB78', // Success color
    500: '#38A169',
    600: '#2F855A',
    700: '#276749',
    800: '#22543D',
    900: '#1C4532',
  },
  warning: {
    50: '#FFFAF0',
    100: '#FEEBC8',
    200: '#FBD38D',
    300: '#F6AD55',
    400: '#ED8936', // Warning color
    500: '#DD6B20',
    600: '#C05621',
    700: '#9C4221',
    800: '#7B341E',
    900: '#652B19',
  },
  error: {
    50: '#FFF5F5',
    100: '#FED7D7',
    200: '#FEB2B2',
    300: '#FC8181',
    400: '#F56565', // Error color
    500: '#E53E3E',
    600: '#C53030',
    700: '#9B2C2C',
    800: '#742A2A',
    900: '#63171B',
  },
  info: {
    50: '#EBF8FF',
    100: '#BEE3F8',
    200: '#90CDF4',
    300: '#63B3ED',
    400: '#4299E1', // Info color
    500: '#3182CE',
    600: '#2B77CB',
    700: '#2C5282',
    800: '#2C5282',
    900: '#1A365D',
  },
  // Neutral grays - Clean, modern grays for text and backgrounds
  gray: {
    50: '#F7FAFC', // Lightest background
    100: '#EDF2F7', // Light background
    200: '#E2E8F0', // Border/divider
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096', // Muted text
    600: '#4A5568',
    700: '#2D3748', // Body text
    800: '#1A202C', // Heading text
    900: '#171923',
  },
}

// Typography based on UX Design Specification
const fonts = {
  body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
}

const fontSizes = {
  xs: '0.75rem',    // 12px - Caption
  sm: '0.875rem',  // 14px - Body Small
  md: '1rem',      // 16px - Body (Default)
  lg: '1.125rem',  // 18px - Body Large / H4
  xl: '1.25rem',   // 20px - H3
  '2xl': '1.5rem', // 24px - H2
  '3xl': '2rem',   // 32px - H1
}

const fontWeights = {
  normal: 400,  // Regular - Body text
  medium: 500,
  semibold: 600, // Semibold - Headings, emphasis
  bold: 700,     // Bold - Strong emphasis
}

// Spacing based on 8px base unit from UX Design Specification
const space = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px - XS
  2: '0.5rem',     // 8px - SM (base unit)
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px - MD
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px - LG
  8: '2rem',       // 32px - XL
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px - 2XL
  16: '4rem',      // 64px - 3XL
}

// Breakpoints for responsive design
const breakpoints = {
  base: '0em',   // 0px - Mobile first
  sm: '30em',    // 480px - Small mobile
  md: '48em',    // 768px - Tablet
  lg: '62em',    // 992px - Desktop
  xl: '80em',    // 1280px - Large desktop
  '2xl': '96em', // 1536px - Extra large desktop
}

// Component styles
const components = {
  Heading: {
    baseStyle: {
      color: 'gray.800', // Default heading color
      fontWeight: 'semibold',
    },
  },
  Text: {
    baseStyle: {
      color: 'gray.700', // Default body text color
    },
  },
  Button: {
    baseStyle: {
      borderRadius: 'full',
      fontWeight: 'semibold',
    },
  },
  Card: {
    baseStyle: {
      borderRadius: 'xl',
      boxShadow: 'sm',
      borderWidth: '1px',
      borderColor: 'gray.100',
    },
  },
}

// Extend Chakra UI default theme
const theme = extendTheme({
  config,
  colors,
  fonts,
  fontSizes,
  fontWeights,
  space,
  breakpoints,
  components,
})

export default theme
