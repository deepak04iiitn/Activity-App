/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  WHITE : '#fff',
  PRIMARY : '#000',
  BLUE : '#0000FF',
  GRAY : '#7d7d7d',
  LIGHT_GRAY : '#f2f2f2',
  SECONDARY: '#1C3D72',         // Darker Blue
  TEXT_PRIMARY: '#333333',      // Dark Grey
  TEXT_SECONDARY: '#555555',    // Medium Grey
  BG_LIGHT: '#F5F7FA',          // Light Greyish-Blue
  BORDER_LIGHT: '#E1E8ED',      // Very Light Grey
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};