# Dhikr App — Roadmap

---

## Done ✅

### Core app
- [x] Ring counter — tap to increment, long-press to decrement
- [x] 6 phrases: Subhanallah, Alhamdulillah, Allahu Akbar, Astaghfirullah, La ilaha illallah, Salawat
- [x] Target selector pills: 33 / 99 / 100 / 1K / ∞
- [x] Circular dot ring for target=33; animated arc for all others
- [x] Completion animation — flash + banner + haptic on target hit
- [x] Swipe left/right to change phrase (saves session)
- [x] Today's cumulative count (resets at midnight, including mid-session)
- [x] Pocket mode (near-black screen, tap anywhere, long-press to exit)
- [x] Shake to count (expo-sensors)
- [x] Haptic feedback (expo-haptics)
- [x] Volume button to count — Android (react-native-volume-manager, works in dev build)
- [x] Keep screen awake during use (expo-keep-awake)
- [x] Persistence across sessions (AsyncStorage)
- [x] Custom target input in Settings
- [x] Custom phrases — add your own Arabic dhikr with transliteration + meaning
- [x] History redesigned — 7-day bar chart + all-time per-phrase totals (no session list)
- [x] Prayer times — next prayer on main screen, local notifications 7 days ahead

### Technical
- [x] Safe area handling — SafeAreaView, works on Dynamic Island / notch
- [x] Arabic font (NotoNaskhArabic) loaded and applied to all Arabic text
- [x] DhikrScreen refactored — modals extracted to separate components
- [x] volumeBtn persisted to AsyncStorage
- [x] app.json: bundleIdentifier, android.package, NSLocationWhenInUseUsageDescription
- [x] eas.json: development / preview / production build profiles
- [x] phraseTotals accumulated forever in AsyncStorage
- [x] dailyTotals archived at midnight (mid-session aware)

---

## 🟡 Store Submission Blockers

### 1. Privacy policy URL ✅
- Added `privacyPolicyUrl` to `app.json` for iOS and Android
- URL: `https://imufil.github.io/dhikr/privacy`
- **Still needed: host the actual page** (GitHub Pages is simplest)
- Content: "No data leaves your device. Location is used only to calculate prayer times locally."

### 2. Cairo font applied ✅
- `fontFamily: fonts.ui` added to all UI text in DhikrScreen, HistoryModal, SettingsModal, PhrasesModal
- `fontFamily: fonts.uiBold` applied to banner text, settings labels, add-phrase button

### 3. `onComplete` stale closure fixed ✅
- Now uses `countRef.current`, `phraseIndexRef.current`, `targetRef.current`, `allPhrasesRef.current`
- Dependency array reduced to `[completing, triggerHaptic, flashScreen, showBanner]`

### 4. Prayer scheduler trigger type fixed ✅
- Replaced `as any` with `ScheduleTrigger` type extracted from `scheduleNotificationAsync` signature
- Type-safe, won't break on SDK upgrades

### 5. Active-phrase deletion bug fixed ✅
- Now resets `phraseIndex` to 0 when the deleted phrase is the currently active one

### 6. Store screenshots ⚠️ MANUAL
- Minimum 3 per platform (iPhone 15 Pro Max + iPhone SE for iOS)
- **Must be done manually in simulator or on device**

---

## V1.1 — First 30 Days After Launch

- [ ] One-time swipe tooltip (replace invisible 9px hint)
- [ ] Show "using Mecca times" when locationDenied — `locationDenied` is returned from hook but never consumed in DhikrScreen
- [ ] `expo-store-review` prompt after 3rd session completion
- [ ] Fix Salawat phrase → "اللَّهُمَّ صَلِّ عَلَى مُحَمَّد" (current form is imperative address)
- [ ] Arabic App Store metadata — keywords: ذكر، تسبيح، مسبحة، صلاة
- [ ] Bismillah on launch (common expectation in Islamic apps)
- [ ] Pocket mode activation confirmation (brief fade-in text "Pocket mode · hold to exit")

---

## V2 — Meaningful Expansion

- [ ] Prayer calculation method selector (MuslimWorldLeague / ISNA / Karachi) — one setting change
- [ ] Daily intention / flexible goal (e.g. "100 Subhanallah before Maghrib")
- [ ] Lock-screen / home-screen widget — commute use-case
- [ ] One-time IAP "Support the Dev" via expo-iap — Settings only, no feature gating
- [ ] Green color theme option

---

## Monetization plan

1. **One-time IAP** — "Jazakallah Khayran / Support the Dev" — never in the counting flow
2. **Noor Ads** — halal contextual SDK (no user tracking). Integrate when SDK is available. Ad slots reserved: below target pills, below history chart.

---

## Business context

- **Brand promise:** no tracking, no account, no subscription, data stays on device
- **Launch strategy:** Android first via EAS preview, iOS 4–6 weeks later
- **Ramadan 2026 (Feb/March)** — launch now to build 12 months of organic ranking
- **IAP framing:** "Jazakallah khayran" donation, not a subscription
- **Review prompt:** trigger after 3rd session completion, never on first launch
