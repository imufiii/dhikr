import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

// TODO: replace with actual Barakah Budget App Store URL
const APP_STORE_URL = 'https://apps.apple.com/app/barakah-budget/REPLACE_WITH_ID';

export default function BarakahBudgetCard() {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => Linking.openURL(APP_STORE_URL)}
      activeOpacity={0.75}
    >
      <View style={styles.iconBox}>
        <Text style={styles.iconText}>☽</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.eyebrow}>From the same developer</Text>
        <Text style={styles.name}>Barakah Budget</Text>
        <Text style={styles.tagline}>Halal finance · Zakat, goals, no riba</Text>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>Free</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201,168,76,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    marginBottom: 20,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconText: {
    fontSize: 20,
    color: colors.gold,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    fontSize: 9,
    color: colors.gold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontFamily: fonts.ui,
    opacity: 0.8,
  },
  name: {
    fontSize: 14,
    color: colors.white,
    fontFamily: fonts.uiBold,
  },
  tagline: {
    fontSize: 11,
    color: colors.muted,
    fontFamily: fonts.ui,
  },
  badge: {
    backgroundColor: colors.gold,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    color: colors.bg,
    fontFamily: fonts.uiBold,
    letterSpacing: 0.3,
  },
});
