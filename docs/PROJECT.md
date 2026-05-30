# Dhikr App — Project Overview

**Stack:** Expo SDK 56 · React Native 0.85.3 · TypeScript · Managed workflow  
**Bundle ID:** `com.mufeedmuneer.dhikr` (iOS & Android)  
**Entry point:** `index.ts` → `App.tsx` → `DhikrScreen`

---

## What the app does

A minimal Islamic dhikr (prayer bead) counter. The user taps the ring to count, swipes to change the phrase, and the app tracks sessions and daily totals.

**Core interactions:**
- Tap ring → increment
- Long-press ring → decrement
- Tap phrase area / swipe left-right → switch phrase (saves current session to history)
- Reset button → saves session, resets to 0
- Target pills → set completion target (33 / 99 / 100 / 1K / ∞)
- Pocket mode → near-black screen, tap anywhere to count, long-press to exit

---

## File structure

```
App.tsx                          ← root: SafeAreaProvider, font loading, SplashScreen
index.ts                         ← registerRootComponent

src/
  screens/
    DhikrScreen.tsx              ← main screen, all counter logic and state
  components/
    HistoryModal.tsx             ← bottom sheet: last 30 sessions
    SettingsModal.tsx            ← bottom sheet: haptic, shake, volume btn, custom target
  hooks/
    useShakeDetector.ts          ← accelerometer shake → increment (expo-sensors)
    usePocketMode.ts             ← dims screen to near-black (expo-brightness)
    useVolumeButton.ts           ← Android vol-up → increment (react-native-volume-manager, stubbed for Expo Go)
  store/
    dhikrStore.ts                ← AsyncStorage load/save, DhikrState interface, todayString()
  constants/
    phrases.ts                   ← PHRASES array (ar/ro/en), TARGETS array
    theme.ts                     ← colors, fonts

docs/
  PROJECT.md                     ← this file
  ROADMAP.md                     ← what's done, what's next
  BUILD.md                       ← how to run and ship
```

---

## State (DhikrState — persisted to AsyncStorage)

| Field | Type | Default | Notes |
|---|---|---|---|
| phraseIndex | number | 0 | Index into PHRASES array |
| target | number | 33 | Active completion target |
| haptic | boolean | true | Vibrate on count |
| shake | boolean | true | Shake to count |
| volumeBtn | boolean | true | Android vol-up to count |
| history | SessionRecord[] | [] | Capped at 30 sessions |
| todayCount | number | 0 | Resets daily (checked on load + every 60s) |
| lastDate | string | '' | en-GB date string, used for daily reset |

**SessionRecord fields:** phraseRo, phraseAr, count, target, duration (seconds), date

---

## Fonts

Loaded at startup in `App.tsx` via `@expo-google-fonts`:

| Theme key | Font name | Used on |
|---|---|---|
| `fonts.arabic` | NotoNaskhArabic_400Regular | All Arabic text |
| `fonts.ui` | Cairo_400Regular | (available, not yet applied to UI) |
| `fonts.uiBold` | Cairo_600SemiBold | (available, not yet applied) |

SplashScreen is held until fonts resolve — no flash of unstyled Arabic text.

---

## Hooks

### useShakeDetector
- Uses `expo-sensors` Accelerometer at 100ms intervals
- Fires `onShake` when magnitude > 1.8g with 400ms cooldown
- Disabled when `shake` setting is off

### usePocketMode
- Saves current brightness, sets it to 0.01 on enter
- Restores brightness on exit
- Overlay is full-screen black, tap = count, long-press 600ms = exit

### useVolumeButton
- Android only (`Platform.OS !== 'android'` guard)
- Uses `react-native-volume-manager` via dynamic `require` in a try/catch
- Silently no-ops in Expo Go; activates automatically in dev/native builds

---

## Key architectural decisions

1. **All state in DhikrScreen** — no global state library. App is one screen; prop drilling to modals is fine.
2. **Modals as separate components** — `HistoryModal` and `SettingsModal` take props, own their styles.
3. **Volume button stub** — dynamic require prevents Metro bundler crash in Expo Go without removing the feature.
4. **Midnight reset via interval** — `loadState()` resets `todayCount` on cold start; a 60s `setInterval` handles the case where the app stays open past midnight.
5. **Noor Ads** — halal contextual ad SDK (no user tracking). Will be integrated when SDK is available. Ad slots reserved: below target pills on main screen, below history list in HistoryModal. No analytics or tracking SDKs to be added in the meantime.
