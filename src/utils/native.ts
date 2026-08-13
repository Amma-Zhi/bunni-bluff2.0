import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { SplashScreen } from '@capacitor/splash-screen';

export type AppOrientation = 'landscape' | 'portrait';

export async function hapticTap(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Some iPads and older devices do not provide haptics. The game still works normally.
  }
}

export async function setNativeOrientation(orientation: AppOrientation): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await ScreenOrientation.lock({ orientation });
  } catch {
    // Keep the responsive web layout as a fallback when orientation lock is unavailable.
  }
}

export async function initializeNativeShell(orientation: AppOrientation): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  await Promise.allSettled([
    setNativeOrientation(orientation),
    SplashScreen.hide(),
  ]);
}
