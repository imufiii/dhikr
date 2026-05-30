import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Coordinates, CalculationMethod, PrayerTimes, Prayer } from 'adhan';

const CHANNEL_ID = 'prayer-times';

type ScheduleTrigger = Parameters<typeof Notifications.scheduleNotificationAsync>[0]['trigger'];

const PRAYER_LABELS: Record<string, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

const FAJR_BODY = 'الصلاة خير من النوم — Prayer is better than sleep';
const DEFAULT_BODY = 'حي على الصلاة — Come to prayer';

export async function setupNotificationChannel() {
  if (Platform.OS !== 'android') return;
  try {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Prayer Times',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      enableVibrate: true,
    });
  } catch {}
}

export async function schedulePrayerNotifications(lat: number, lng: number) {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    const coordinates = new Coordinates(lat, lng);
    const params = CalculationMethod.MuslimWorldLeague();
    const now = new Date();

    for (let day = 0; day < 7; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);

      const times = new PrayerTimes(coordinates, date, params);
      const prayers: [string, Date][] = [
        ['fajr', times.fajr],
        ['dhuhr', times.dhuhr],
        ['asr', times.asr],
        ['maghrib', times.maghrib],
        ['isha', times.isha],
      ];

      for (const [name, time] of prayers) {
        if (time <= now) continue;
        const label = PRAYER_LABELS[name];
        if (!label) continue;

        const trigger: ScheduleTrigger = Platform.OS === 'android'
          ? { date: time, channelId: CHANNEL_ID } as ScheduleTrigger
          : { date: time } as ScheduleTrigger;

        await Notifications.scheduleNotificationAsync({
          content: {
            title: label,
            body: name === Prayer.Fajr ? FAJR_BODY : DEFAULT_BODY,
            sound: true,
          },
          trigger,
        });
      }
    }
  } catch {}
}
