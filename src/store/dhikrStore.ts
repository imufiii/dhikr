import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SessionRecord {
  phraseRo: string;
  phraseAr: string;
  count: number;
  target: number;
  duration: number;
  date: string;
}

export interface CustomPhrase {
  ar: string;
  ro: string;
  en: string;
}

export interface DhikrState {
  phraseIndex: number;
  target: number;
  haptic: boolean;
  shake: boolean;
  volumeBtn: boolean;
  history: SessionRecord[];
  todayCount: number;
  lastDate: string;
  dailyTotals: Record<string, number>;
  customPhrases: CustomPhrase[];
  phraseTotals: Record<string, number>;
}

const KEY = 'dhikr_state_v2';

const defaults: DhikrState = {
  phraseIndex: 0,
  target: 33,
  haptic: true,
  shake: true,
  volumeBtn: true,
  history: [],
  todayCount: 0,
  lastDate: '',
  dailyTotals: {},
  customPhrases: [],
  phraseTotals: {},
};

export function todayString() {
  return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function last7Days(): { dateStr: string; weekday: string }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      weekday: d.toLocaleDateString('en', { weekday: 'short' }),
    };
  });
}

export async function loadState(): Promise<DhikrState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const s: DhikrState = raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
    const today = todayString();
    if (s.lastDate !== today) {
      // Save yesterday's total before resetting
      if (s.lastDate && s.todayCount > 0) {
        s.dailyTotals = { ...s.dailyTotals, [s.lastDate]: s.todayCount };
      }
      s.todayCount = 0;
      s.lastDate = today;
    }
    // Prune totals older than 60 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 60);
    const pruned: Record<string, number> = {};
    for (const [date, count] of Object.entries(s.dailyTotals)) {
      if (new Date(date) >= cutoff) pruned[date] = count;
    }
    s.dailyTotals = pruned;
    return s;
  } catch {
    return { ...defaults, lastDate: todayString() };
  }
}

export async function saveState(state: DhikrState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}
