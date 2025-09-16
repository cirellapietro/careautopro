import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0f562adbd8054198a563281f8594b2e6',
  appName: 'how-to-supabase',
  webDir: 'dist',
  server: {
    url: 'https://0f562adb-d805-4198-a563-281f8594b2e6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: false
    }
  }
};

export default config;