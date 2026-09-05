export type Ruling = 'fard' | 'sunnah' | 'nafl' | 'recommended';

export interface RoutineItem {
  id: string;
  title: string;
  sub?: string;
  block: string;
  ruling: Ruling;
}

export interface RoutineBlock {
  key: string;
  label: string;
}

// Prayer-anchored time blocks, in the order of the Islamic day.
export const ROUTINE_BLOCKS: RoutineBlock[] = [
  { key: 'night',   label: 'Last third of night' },
  { key: 'fajr',    label: 'Fajr' },
  { key: 'morning', label: 'Morning' },
  { key: 'evening', label: 'After Asr' },
  { key: 'maghrib', label: 'After Maghrib' },
  { key: 'isha',    label: 'Isha' },
  { key: 'sleep',   label: 'Before sleep' },
];

// A sensible default routine covering the daily rhythm. Rulings are labelled
// honestly so nothing voluntary is shown as obligatory. Fully editable — hide,
// add or remove any item.
export const DEFAULT_ROUTINE: RoutineItem[] = [
  { id: 'r_tahajjud',      title: 'Tahajjud',              sub: '2–8 rakʿah',      block: 'night',   ruling: 'nafl' },
  { id: 'r_night_dua',     title: 'Dua on waking at night',                        block: 'night',   ruling: 'sunnah' },
  { id: 'r_fajr',          title: 'Fajr prayer',           sub: '2 rakʿah',        block: 'fajr',    ruling: 'fard' },
  { id: 'r_after_adhan',   title: 'Dua after adhan',                               block: 'fajr',    ruling: 'sunnah' },
  { id: 'r_after_wudu',    title: 'Dua after wudu',                                block: 'fajr',    ruling: 'sunnah' },
  { id: 'r_morning_adhkar',title: 'Morning adhkar',                                block: 'morning', ruling: 'sunnah' },
  { id: 'r_duha',          title: 'Duha prayer',           sub: 'after sunrise',   block: 'morning', ruling: 'nafl' },
  { id: 'r_quran',         title: 'Read Qur’an',           sub: '1 page',          block: 'morning', ruling: 'recommended' },
  { id: 'r_evening_adhkar',title: 'Evening adhkar',                                block: 'evening', ruling: 'sunnah' },
  { id: 'r_tawbah',        title: 'Tawbah & Istighfar',                            block: 'maghrib', ruling: 'sunnah' },
  { id: 'r_isha',          title: 'Isha prayer',           sub: '4 rakʿah',        block: 'isha',    ruling: 'fard' },
  { id: 'r_witr',          title: 'Witr',                  sub: '1–3 rakʿah',      block: 'isha',    ruling: 'sunnah' },
  { id: 'r_wudu_sleep',    title: 'Wudu before sleeping',                          block: 'sleep',   ruling: 'sunnah' },
  { id: 'r_sajda',         title: 'Surah As-Sajdah',       sub: 'before sleeping', block: 'sleep',   ruling: 'recommended' },
  { id: 'r_mulk',          title: 'Surah Al-Mulk',         sub: 'before sleeping', block: 'sleep',   ruling: 'sunnah' },
  { id: 'r_sleep_dua',     title: 'Sleep dua',                                     block: 'sleep',   ruling: 'sunnah' },
];

export const RULING_LABEL: Record<Ruling, string> = {
  fard: 'Fard',
  sunnah: 'Sunnah',
  nafl: 'Nafl',
  recommended: 'Recommended',
};
