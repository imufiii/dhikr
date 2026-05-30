import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_KEY = 'dhikr_coords';
// Fallback coords (Mecca) so prayer times always show even without GPS
const FALLBACK = { lat: 21.3891, lng: 39.8579 };

export interface NextPrayerInfo {
  name: string;
  timeString: string;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function calcNextPrayer(lat: number, lng: number): NextPrayerInfo | null {
  try {
    // Dynamic require keeps adhan errors isolated
    const { Coordinates, CalculationMethod, PrayerTimes, Prayer } = require('adhan');
    const coordinates = new Coordinates(lat, lng);
    const params = CalculationMethod.MuslimWorldLeague();
    const now = new Date();
    const times = new PrayerTimes(coordinates, now, params);

    const next: string = times.nextPrayer();

    const labels: Record<string, string> = {
      fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha',
    };

    if (next === Prayer.None || next === 'none') {
      // Past Isha — show tomorrow's Fajr
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTimes = new PrayerTimes(coordinates, tomorrow, params);
      return { name: 'Fajr', timeString: formatTime(tomorrowTimes.fajr) };
    }

    const label = labels[next];
    if (!label) return null;
    const time: Date = times.timeForPrayer(next);
    return { name: label, timeString: formatTime(time) };
  } catch {
    return null;
  }
}

export function usePrayerTimes() {
  // Start with Mecca so something always shows immediately
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo | null>(
    () => calcNextPrayer(FALLBACK.lat, FALLBACK.lng)
  );
  const [locationDenied, setLocationDenied] = useState(false);
  const coordsRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (coordsRef.current) {
        const result = calcNextPrayer(coordsRef.current.lat, coordsRef.current.lng);
        setNextPrayer(result);
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  async function init() {
    // Show cached result immediately
    try {
      const cached = await AsyncStorage.getItem(LOCATION_KEY);
      if (cached) {
        const coords = JSON.parse(cached);
        coordsRef.current = coords;
        setNextPrayer(calcNextPrayer(coords.lat, coords.lng));
      }
    } catch {}

    // Get fresh location
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationDenied(true);
        // Still show prayer times using fallback
        if (!coordsRef.current) {
          coordsRef.current = FALLBACK;
          setNextPrayer(calcNextPrayer(FALLBACK.lat, FALLBACK.lng));
        }
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
      const coords = { lat: loc.coords.latitude, lng: loc.coords.longitude };
      coordsRef.current = coords;
      await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(coords));
      setNextPrayer(calcNextPrayer(coords.lat, coords.lng));

      try {
        const { schedulePrayerNotifications } = require('../utils/prayerScheduler');
        schedulePrayerNotifications(coords.lat, coords.lng);
      } catch {}
    } catch {
      // GPS failed — use fallback if nothing cached
      if (!coordsRef.current) {
        coordsRef.current = FALLBACK;
        setNextPrayer(calcNextPrayer(FALLBACK.lat, FALLBACK.lng));
      }
    }
  }

  return { nextPrayer, locationDenied };
}
