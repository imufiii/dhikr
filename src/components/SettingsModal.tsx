import React from 'react'; // needed for JSX transform compatibility
import {
  Linking, Modal, Platform, Pressable, ScrollView,
  StyleSheet, Switch, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { colors, fonts } from '../constants/theme';
import BarakahBudgetCard from './BarakahBudgetCard';

const PRIVACY_URL = 'https://imufiii.github.io/dhikr/privacy.html';
const TERMS_URL   = 'https://imufiii.github.io/dhikr/terms.html';
const SUPPORT_URL = 'https://imufiii.github.io/dhikr/support.html';

interface Props {
  visible: boolean;
  haptic: boolean;
  setHaptic: (v: boolean) => void;
  shake: boolean;
  setShake: (v: boolean) => void;
  target: number;
  selectTarget: (t: number) => void;
  onManagePhrases: () => void;
  onClose: () => void;
}

function Icon({ symbol, bg }: { symbol: string; bg: string }) {
  return (
    <View style={[styles.iconBox, { backgroundColor: bg }]}>
      <Text style={styles.iconSymbol}>{symbol}</Text>
    </View>
  );
}

function SwitchRow({ icon, bg, label, sub, value, onChange }: {
  icon: string; bg: string; label: string; sub: string;
  value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Icon symbol={icon} bg={bg} />
      <View style={styles.rowText}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      <Switch value={value} onValueChange={onChange}
        trackColor={{ false: colors.muted2, true: colors.gold }}
        thumbColor={colors.white} />
    </View>
  );
}

function LinkRow({ icon, bg, label, sub, onPress, last }: {
  icon: string; bg: string; label: string; sub: string;
  onPress: () => void; last?: boolean;
}) {
  return (
    <TouchableOpacity style={[styles.row, last && styles.rowLast]} onPress={onPress} activeOpacity={0.65}>
      <Icon symbol={icon} bg={bg} />
      <View style={styles.rowText}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function SettingsModal({
  visible, haptic, setHaptic, shake, setShake,
  target, selectTarget,
  onManagePhrases, onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Settings</Text>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

            {/* Counter */}
            <Text style={styles.sectionLabel}>Counter</Text>
            <View style={styles.card}>
              <SwitchRow icon="◎" bg="#1A3A2A" label="Haptic Feedback" sub="Vibrate on each count" value={haptic} onChange={setHaptic} />
              <SwitchRow icon="⟲" bg="#1A2A3A" label="Shake to Count" sub="Shake phone to increment" value={shake} onChange={setShake} last />
            </View>

            {/* Target */}
            <Text style={styles.sectionLabel}>Target</Text>
            <View style={styles.card}>
              <View style={[styles.row, styles.rowLast]}>
                <Icon symbol="◈" bg="#2A2A1A" />
                <View style={styles.rowText}>
                  <Text style={styles.label}>Custom Target</Text>
                  <Text style={styles.sub}>Set any number as your goal</Text>
                </View>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  placeholder="e.g. 500"
                  placeholderTextColor={colors.muted}
                  defaultValue={![0, 33, 99, 100, 1000].includes(target) ? String(target) : ''}
                  onEndEditing={e => {
                    const n = parseInt(e.nativeEvent.text);
                    if (!isNaN(n) && n > 0) selectTarget(n);
                  }}
                />
              </View>
            </View>

            {/* Phrases */}
            <Text style={styles.sectionLabel}>Phrases</Text>
            <View style={styles.card}>
              <LinkRow icon="۞" bg="#1A2A2A" label="Custom Phrases" sub="Add your own Arabic dhikr" onPress={onManagePhrases} last />
            </View>

            {/* About */}
            <Text style={styles.sectionLabel}>About</Text>
            <View style={styles.card}>
              <LinkRow icon="?" bg="#1A2A3A" label="Support" sub="Get help or send feedback" onPress={() => Linking.openURL(SUPPORT_URL)} />
              <LinkRow icon="◉" bg="#1A3A2A" label="Privacy Policy" sub="No data leaves your device" onPress={() => Linking.openURL(PRIVACY_URL)} />
              <LinkRow icon="≡" bg="#2A2A1A" label="Terms of Use" sub="imufiii.github.io/dhikr" onPress={() => Linking.openURL(TERMS_URL)} last />
            </View>

            {/* The live served Noor ad now lives on the main screen (a single
                serve per session). This stays a static Barakah Budget cross-promo. */}
            <Text style={styles.sectionLabel}>Also from us</Text>
            <BarakahBudgetCard />

            <Text style={styles.version}>Dhikr · v1.0.0</Text>

          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,20,18,0.9)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#111C2A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
    borderTopWidth: 1,
    borderTopColor: colors.goldDim,
    maxHeight: '88%',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.muted2,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    fontFamily: fonts.uiBold,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  sectionLabel: {
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: fonts.ui,
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 4,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: 12,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconSymbol: {
    fontSize: 15,
    color: colors.gold,
  },
  rowText: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: colors.white,
    fontFamily: fonts.uiBold,
  },
  sub: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 1,
    fontFamily: fonts.ui,
  },
  chevron: {
    fontSize: 20,
    color: colors.muted,
    marginRight: -2,
  },
  input: {
    backgroundColor: colors.muted2,
    borderWidth: 1,
    borderColor: colors.goldDim,
    color: colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    width: 80,
    textAlign: 'center',
    fontFamily: fonts.ui,
  },
  version: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.muted,
    opacity: 0.4,
    fontFamily: fonts.ui,
    letterSpacing: 1,
    marginBottom: 8,
  },
});
