import React from 'react';
import {
  Modal, Platform, Pressable, StyleSheet,
  Switch, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { colors, fonts } from '../constants/theme';

interface Props {
  visible: boolean;
  haptic: boolean;
  setHaptic: (v: boolean) => void;
  shake: boolean;
  setShake: (v: boolean) => void;
  volumeBtn: boolean;
  setVolumeBtn: (v: boolean) => void;
  target: number;
  selectTarget: (t: number) => void;
  onManagePhrases: () => void;
  onClose: () => void;
}

export default function SettingsModal({
  visible, haptic, setHaptic, shake, setShake,
  volumeBtn, setVolumeBtn, target, selectTarget,
  onManagePhrases, onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Settings</Text>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Haptic Feedback</Text>
              <Text style={styles.sub}>Vibrate on each count</Text>
            </View>
            <Switch value={haptic} onValueChange={setHaptic}
              trackColor={{ false: colors.muted2, true: colors.gold }}
              thumbColor={colors.white} />
          </View>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Shake to Count</Text>
              <Text style={styles.sub}>Shake phone to increment</Text>
            </View>
            <Switch value={shake} onValueChange={setShake}
              trackColor={{ false: colors.muted2, true: colors.gold }}
              thumbColor={colors.white} />
          </View>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Volume Button (Android)</Text>
              <Text style={styles.sub}>Vol-up counts even on lock screen</Text>
            </View>
            <Switch value={volumeBtn} onValueChange={setVolumeBtn}
              trackColor={{ false: colors.muted2, true: colors.gold }}
              thumbColor={colors.white} />
          </View>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Custom Target</Text>
              <Text style={styles.sub}>Enter any number</Text>
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

          <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]} onPress={onManagePhrases} activeOpacity={0.7}>
            <View>
              <Text style={styles.label}>Custom Phrases</Text>
              <Text style={styles.sub}>Add your own Arabic dhikr</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(13,31,26,0.85)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#162032',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
    borderTopWidth: 1,
    borderTopColor: colors.goldDim,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.muted2,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 20,
    fontFamily: fonts.ui,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted2,
  },
  label: {
    fontSize: 14,
    color: colors.white,
    fontFamily: fonts.uiBold,
  },
  sub: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
    fontFamily: fonts.ui,
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
  },
  chevron: {
    fontSize: 22,
    color: colors.muted,
  },
});
