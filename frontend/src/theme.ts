import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#E6F6FF',
      100: '#BAE3FF',
      200: '#7CC4FA',
      300: '#47A3F3',
      400: '#2186EB',
      500: '#0967D2',
      600: '#0552B5',
      700: '#03449E',
      800: '#01337D',
      900: '#002159',
    },
  },
  semanticTokens: {
    colors: {
      background: {
        default: 'gray.50',
        _dark: 'gray.900'
      },
      surface: {
        default: 'white',
        _dark: 'gray.800'
      },
      mutedText: {
        default: 'gray.600',
        _dark: 'gray.400'
      },
      border: {
        default: 'gray.200',
        _dark: 'gray.700'
      },
      primary: {
        default: 'brand.500',
        _dark: 'brand.300'
      },
      accent: {
        default: 'brand.400',
        _dark: 'brand.200'
      }
    }
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'background',
      },
    },
  },
});

export default theme;