import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,

  fonts: {
    ...MD3LightTheme.fonts,

    titleLarge: {
      fontFamily: 'BebasNeue',
      fontSize: 42,
    },

    titleMedium: {
      fontFamily: 'OdibeeSans',
      fontSize: 22,
    },

    bodyLarge: {
      fontFamily: 'Sora',
      fontSize: 18,
    },

    bodyMedium: {
      fontFamily: 'Sora',
      fontSize: 14,
    },

    bodySmall: {
      fontFamily: 'Sora',
      fontSize: 12,
    },
  },
};
