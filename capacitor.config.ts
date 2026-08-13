import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ammazhi.bunnibluff',
  appName: '萌心小丑牌',
  webDir: 'dist',
  backgroundColor: '#F8F4EE',
  ios: {
    contentInset: 'always',
    scheme: 'BunniBluff',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 900,
      backgroundColor: '#FFF4F7',
      showSpinner: false,
    },
  },
};

export default config;
