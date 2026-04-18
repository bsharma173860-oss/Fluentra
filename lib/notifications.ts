/**
 * Push notifications wrapper.
 * Install the package first: npx expo install expo-notifications
 * All functions are no-ops until the package is available.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
function getNotifications(): any | null {
  try { return require('expo-notifications'); } catch { return null; }
}

export async function requestPermissions(): Promise<boolean> {
  try {
    const N = getNotifications();
    if (!N) return false;
    const { status } = await N.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

export async function scheduleStreakReminder(hour = 20): Promise<void> {
  try {
    const N = getNotifications();
    if (!N) return;
    await N.cancelAllScheduledNotificationsAsync();
    await N.scheduleNotificationAsync({
      content: {
        title: "Don't break your streak! 🔥",
        body: 'Practice for 5 minutes to keep your streak alive.',
        data: { screen: 'home' },
      },
      trigger: { hour, minute: 0, repeats: true },
    });
  } catch {}
}

export async function cancelStreakReminder(): Promise<void> {
  try {
    const N = getNotifications();
    if (!N) return;
    await N.cancelAllScheduledNotificationsAsync();
  } catch {}
}

export async function sendStreakMilestone(days: number): Promise<void> {
  try {
    const N = getNotifications();
    if (!N) return;
    await N.scheduleNotificationAsync({
      content: {
        title: `${days}-day streak! 🎉`,
        body: days === 40 ? "You've unlocked the monthly exam!" : "Keep going — you're on fire!",
      },
      trigger: null,
    });
  } catch {}
}
