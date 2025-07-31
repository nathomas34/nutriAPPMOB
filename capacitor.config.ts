import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fitnutri.app',
  appName: 'FITNUTRI',
  webDir: 'dist/demo',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0A0A0A",
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0A0A0A'
    },
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;