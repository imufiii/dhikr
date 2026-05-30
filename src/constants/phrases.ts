export interface Phrase {
  ar: string;
  ro: string;
  en: string;
}

export const PHRASES: Phrase[] = [
  { ar: 'سُبْحَانَ اللّٰه',           ro: 'Subhanallah',      en: 'Glory be to Allah' },
  { ar: 'الْحَمْدُ لِلَّٰه',         ro: 'Alhamdulillah',    en: 'All praise be to Allah' },
  { ar: 'اللَّٰهُ أَكْبَر',           ro: 'Allahu Akbar',     en: 'Allah is the Greatest' },
  { ar: 'أَسْتَغْفِرُ اللَّٰه',      ro: 'Astaghfirullah',   en: 'I seek forgiveness from Allah' },
  { ar: 'لَا إِلٰهَ إِلَّا اللَّٰه', ro: 'La ilaha illallah', en: 'There is no god but Allah' },
  { ar: 'صَلِّ عَلَى النَّبِيّ',     ro: 'Salawat',          en: 'Send blessings upon the Prophet' },
];

export const TARGETS = [33, 99, 100, 1000, 0] as const;
