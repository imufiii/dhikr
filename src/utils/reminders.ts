import * as Notifications from 'expo-notifications';

// Three gentle daily nudges, aligned to the routine's rhythm.
const REMINDERS = [
  { hour: 7,  minute: 0,  title: 'Morning adhkar', body: 'Begin the day with the morning remembrance.' },
  { hour: 18, minute: 0,  title: 'Evening adhkar', body: 'A moment for the evening remembrance.' },
  { hour: 22, minute: 0,  title: 'Before sleep',   body: 'Surah Al-Mulk and your sleep duʿāʾ.' },
];

// Turn on daily reminders. Returns false if the user denies notifications.
export async function enableReminders(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  let granted = current.granted || current.status === 'granted';
  if (!granted) {
    const req = await Notifications.requestPermissionsAsync();
    granted = req.granted || req.status === 'granted';
  }
  if (!granted) return false;

  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const r of REMINDERS) {
    await Notifications.scheduleNotificationAsync({
      content: { title: r.title, body: r.body },
      // Daily repeating calendar trigger (typed loosely across SDK versions).
      trigger: { hour: r.hour, minute: r.minute, repeats: true } as any,
    });
  }
  return true;
}

export async function disableReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
