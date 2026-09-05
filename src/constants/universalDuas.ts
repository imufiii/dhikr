export interface UserDua {
  id: string;
  title?: string;
  arabicText: string;
  transliteration: string;
  englishMeaning: string;
  source: string;
  category: string;
  isBuiltIn?: boolean;
}

export const UNIVERSAL_DUAS: UserDua[] = [
  {
    id: 'universal_1',
    title: 'Trust in Allah',
    arabicText: 'حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم',
    transliteration: 'Hasbiyallahu la ilaha illa huwa alaihi tawakkaltu wa huwa rabbul arshil azeem',
    englishMeaning: 'Allah is sufficient for me. There is no deity except Him. I have placed my trust in Him, and He is the Lord of the Great Throne.',
    source: 'Fortress of the Muslim',
    category: 'General',
    isBuiltIn: true,
  },
  {
    id: 'universal_2',
    title: 'Praise',
    arabicText: 'الحمد لله حمداً كثيراً طيباً مباركاً فيه',
    transliteration: 'Alhamdulillahi hamdan kathiran tayyiban mubarakan fih',
    englishMeaning: 'All praise is due to Allah - praise that is abundant, pure, and blessed.',
    source: 'Fortress of the Muslim',
    category: 'General',
    isBuiltIn: true,
  },
  {
    id: 'universal_3',
    title: 'Tasbeeh',
    arabicText: 'سبحان الله والحمد لله ولا إله إلا الله والله أكبر',
    transliteration: 'Subhanallah wa alhamdulillah wa la ilaha illallah wa allahu akbar',
    englishMeaning: 'Glory be to Allah, and praise be to Allah, and there is no deity except Allah, and Allah is the Greatest.',
    source: 'Sahih Muslim',
    category: 'General',
    isBuiltIn: true,
  },
  {
    id: 'universal_4',
    title: 'Relief from Anxiety',
    arabicText: 'اللهم إني أعوذ بك من الهم والحزن، وأعوذ بك من العجز والكسل',
    transliteration: 'Allahumma inni a\'oodhu bika minal hammi wal hazani, wa a\'oodhu bika minal ajzi wal kasal',
    englishMeaning: 'O Allah, I seek refuge in You from anxiety and sorrow, and I seek refuge in You from weakness and laziness.',
    source: 'Sahih Bukhari',
    category: 'General',
    isBuiltIn: true,
  },
];
