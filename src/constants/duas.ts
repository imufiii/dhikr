export interface Dua {
  id: string;
  situation: 'anxiety' | 'health' | 'work' | 'family' | 'gratitude' | 'guidance';
  arabicText: string;
  transliteration: string;
  englishMeaning: string;
  source: string;
  category: string;
}

export const DUAS: Record<string, Dua[]> = {
  anxiety: [
    {
      id: 'anxiety_1',
      situation: 'anxiety',
      arabicText: 'حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم',
      transliteration: "Hasbiyallahu la ilaha illa huwa alaihi tawakkaltu wa huwa rabbul arshil azeem",
      englishMeaning: 'Allah is sufficient for me. There is no deity except Him. I have placed my trust in Him, and He is the Lord of the Great Throne.',
      source: 'Fortress of the Muslim',
      category: 'Anxiety & Worry',
    },
    {
      id: 'anxiety_2',
      situation: 'anxiety',
      arabicText: 'اللهم إني أعوذ بك من الهم والحزن، وأعوذ بك من العجز والكسل',
      transliteration: 'Allahumma inni a\'oodhu bika minal hammi wal hazani, wa a\'oodhu bika minal ajzi wal kasal',
      englishMeaning: 'O Allah, I seek refuge in You from anxiety and sorrow, and I seek refuge in You from weakness and laziness.',
      source: 'Sahih Bukhari',
      category: 'Anxiety & Worry',
    },
    {
      id: 'anxiety_3',
      situation: 'anxiety',
      arabicText: 'يا حي يا قيوم برحمتك أستغيث أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين',
      transliteration: 'Ya Hayyu ya Qayyum birahmatika astaghees, aslih li sha\'ani kullahu wa la takilni ila nafsi tarfata ain',
      englishMeaning: 'O Living One, O Sustainer, by Your mercy I seek help. Set all of my affairs right for me and do not leave me to myself even for the blink of an eye.',
      source: 'Sunan An-Nasa\'i',
      category: 'Anxiety & Worry',
    },
  ],
  health: [
    {
      id: 'health_1',
      situation: 'health',
      arabicText: 'اللهم يا مُعطي يا منع، يا مُذل يا معز، أسألك الشفاء والعافية',
      transliteration: 'Allahumma ya mu\'ati ya mani\', ya mudhil ya mu\'izz, as\'aluka ash-shifa wa al-\'afiyah',
      englishMeaning: 'O Allah, O Giver, O Withholder, O Humiliator, O Exalter, I ask You for healing and well-being.',
      source: 'Fortress of the Muslim',
      category: 'Health & Healing',
    },
    {
      id: 'health_2',
      situation: 'health',
      arabicText: 'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم',
      transliteration: 'Bismillahi alladhi la yadurru ma\'a ismihi shay\'un fil ardi wa la fissamai wa huwa as-Sami\'ul \'Aleem',
      englishMeaning: 'In the name of Allah, with whose name nothing can cause harm in the earth or in the heavens, and He is the All-Hearing, All-Knowing.',
      source: 'Sunan At-Tirmidhi',
      category: 'Health & Healing',
    },
    {
      id: 'health_3',
      situation: 'health',
      arabicText: 'اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري',
      transliteration: 'Allahumma \'afini fi badani, Allahumma \'afini fi sami\'i, Allahumma \'afini fi basari',
      englishMeaning: 'O Allah, grant me well-being in my body. O Allah, grant me well-being in my hearing. O Allah, grant me well-being in my sight.',
      source: 'Sunan Ibn Majah',
      category: 'Health & Healing',
    },
  ],
  work: [
    {
      id: 'work_1',
      situation: 'work',
      arabicText: 'اللهم ارزقني حلالاً طيباً ووفقني في عملي',
      transliteration: 'Allahumma arzqni halalan tayyiban wa waffaqni fi \'amali',
      englishMeaning: 'O Allah, grant me sustenance that is lawful and good, and help me succeed in my work.',
      source: 'Fortress of the Muslim',
      category: 'Work & Success',
    },
    {
      id: 'work_2',
      situation: 'work',
      arabicText: 'اللهم إني أسألك الإخلاص والتقوى والعلم النافع والعمل الصالح',
      transliteration: 'Allahumma inni as\'aluka al-ikhlas wa at-taqwa wa al-\'ilm an-nafi\' wa al-\'amal as-salih',
      englishMeaning: 'O Allah, I ask You for sincerity, piety, beneficial knowledge, and righteous deeds.',
      source: 'Sunan An-Nasa\'i',
      category: 'Work & Success',
    },
    {
      id: 'work_3',
      situation: 'work',
      arabicText: 'رب اشرح لي صدري ويسر لي أمري واحلل عقدة من لساني يفقهوا قولي',
      transliteration: 'Rabbish rahli sadri wa yassir li amri wahlul \'uqdatan min lisani yafqahu qawli',
      englishMeaning: 'My Lord, expand for me my chest [with confidence] and ease for me my task and untie the knot from my tongue that they may understand my speech.',
      source: 'Surah Taha 25-28',
      category: 'Work & Success',
    },
  ],
  family: [
    {
      id: 'family_1',
      situation: 'family',
      arabicText: 'اللهم صلح بيننا وبين والدينا وإخواننا، وارزقنا برهم',
      transliteration: 'Allahumma sallih baynana wa bayna walidayna wa ikhwanina, wa arzqna bbirrhum',
      englishMeaning: 'O Allah, make peace between us and our parents and siblings, and grant us the ability to be kind to them.',
      source: 'Fortress of the Muslim',
      category: 'Family & Relationships',
    },
    {
      id: 'family_2',
      situation: 'family',
      arabicText: 'اللهم ارزقني أهلاً صالحاً ولا تجعل مصيبتي في ديني ودنياي',
      transliteration: 'Allahumma arzqni ahlan salihan wa la taj\'al musibati fi dini wa duniyai',
      englishMeaning: 'O Allah, grant me righteous family and do not make my affliction in my religion or worldly life.',
      source: 'Fortress of the Muslim',
      category: 'Family & Relationships',
    },
    {
      id: 'family_3',
      situation: 'family',
      arabicText: 'اللهم بارك لي في أهلي وفي ذريتي ومولاي، وفي كل خير أوليته إياي',
      transliteration: 'Allahumma barik li fi ahli wa fi dhurriyyati wa fi muwalai, wa fi kulli khayrin awlaytahu iyyai',
      englishMeaning: 'O Allah, bless for me my family and my descendants and my protector, and in every good You have granted me.',
      source: 'Fortress of the Muslim',
      category: 'Family & Relationships',
    },
  ],
  gratitude: [
    {
      id: 'gratitude_1',
      situation: 'gratitude',
      arabicText: 'الحمد لله حمداً كثيراً طيباً مباركاً فيه',
      transliteration: 'Alhamdulillahi hamdan kathiran tayyiban mubarakan fih',
      englishMeaning: 'All praise is due to Allah - praise that is abundant, pure, and blessed.',
      source: 'Fortress of the Muslim',
      category: 'Gratitude',
    },
    {
      id: 'gratitude_2',
      situation: 'gratitude',
      arabicText: 'اللهم لك الحمد على كل حال، أحمدك حمداً يليق بعظمتك',
      transliteration: 'Allahumma laka al-hamdu \'ala kulli hal, ahamiduka hamdan yaliqu bi\'azamatika',
      englishMeaning: 'O Allah, to You belongs all praise in every circumstance. I praise You with praise befitting Your majesty.',
      source: 'Fortress of the Muslim',
      category: 'Gratitude',
    },
  ],
  guidance: [
    {
      id: 'guidance_1',
      situation: 'guidance',
      arabicText: 'اللهم أرني الحق حقاً وارزقني اتباعه، وأرني الباطل باطلاً وارزقني اجتنابه',
      transliteration: 'Allahumma arini al-haqqa haqqan wa arzqni ittiba\'ahu, wa arni al-batila batilan wa arzqni ijtinabuhu',
      englishMeaning: 'O Allah, show me the truth as truth and grant me the ability to follow it, and show me falsehood as falsehood and grant me the ability to avoid it.',
      source: 'Sunan At-Tirmidhi',
      category: 'Guidance & Clarity',
    },
    {
      id: 'guidance_2',
      situation: 'guidance',
      arabicText: 'اللهم اهدني لأحسن الأخلاق لا يهدي لأحسنها إلا أنت، واصرف عني سيئها لا يصرف عني سيئها إلا أنت',
      transliteration: 'Allahumma ihdin li ahsanal akhlaq la yahdi li ahsanaha illa anta, wa asrif anni sayyi\'aha la yasrifu anni sayyi\'aha illa anta',
      englishMeaning: 'O Allah, guide me to the best of characteristics. None can guide to it but You, and keep me away from the worst of characteristics. None can keep away from it but You.',
      source: 'Sunan Muslim',
      category: 'Guidance & Clarity',
    },
  ],
};

export const SITUATIONS = [
  { id: 'anxiety', label: 'Anxiety & Worry', emoji: '😰' },
  { id: 'health', label: 'Health & Healing', emoji: '🏥' },
  { id: 'work', label: 'Work & Success', emoji: '💼' },
  { id: 'family', label: 'Family & Relationships', emoji: '👨‍👩‍👧‍👦' },
  { id: 'gratitude', label: 'Gratitude', emoji: '🙏' },
  { id: 'guidance', label: 'Guidance & Clarity', emoji: '🧭' },
] as const;
