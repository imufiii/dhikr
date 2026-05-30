# Dhikr App — Build & Run Guide

---

## Local development

### Expo Go (quick, most features)
```bash
npx expo start
```
Then scan QR code with Expo Go app (must be v2.33+ for SDK 56).

> Volume button feature is stubbed in Expo Go — it won't crash but won't work. Everything else works.

### iOS Simulator
```bash
npx expo start
# press i in the terminal
```
Make sure Expo Go is installed on the simulator. If not, press `shift + i` from the dev server to install it.

### Android Emulator
```bash
npx expo start
# press a in the terminal
```

---

## Dev build (full native features including volume button)

Required for: volume button on Android, any native SDK.

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

---

## EAS builds

Make sure you're logged in:
```bash
eas login
```

### Preview build (internal distribution / TestFlight)
```bash
# iOS simulator build
eas build --profile preview --platform ios

# Android APK for internal testing
eas build --profile preview --platform android
```

### Production build (App Store / Play Store)
```bash
eas build --profile production --platform all
```

### Submit to stores
```bash
eas submit --platform ios      # App Store Connect
eas submit --platform android  # Google Play
```

---

## Environment

| Tool | Version |
|---|---|
| Expo SDK | ~56.0.5 |
| React Native | 0.85.3 |
| Node | v22.4.1 |
| EAS CLI | >= 16.0.0 |

---

## Key packages

| Package | Purpose |
|---|---|
| expo-haptics | Vibration on count |
| expo-sensors | Shake detection |
| expo-brightness | Pocket mode screen dim |
| expo-keep-awake | Prevent screen lock during use |
| expo-location | Prayer times (not yet used in UI) |
| adhan | Prayer time calculations (not yet used in UI) |
| react-native-volume-manager | Android volume button counter (native, stubbed in Expo Go) |
| @react-native-async-storage/async-storage | Session/settings persistence |
| react-native-svg | Animated ring progress |
| react-native-safe-area-context | Notch / Dynamic Island safe area |
| @expo-google-fonts/cairo | UI font |
| @expo-google-fonts/noto-naskh-arabic | Arabic text font |

---

## Before store submission checklist

- [ ] Privacy policy URL added to app.json and store listing
- [ ] App icons correct for all sizes (check assets/)
- [ ] Version bumped in app.json
- [ ] `eas build --profile production` passes with no errors
- [ ] TestFlight / internal track tested on real device
- [ ] App Store screenshots prepared (Arabic RTL versions for MENA listing)
- [ ] IAP product configured in App Store Connect / Google Play Console
