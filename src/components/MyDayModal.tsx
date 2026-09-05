import React, { useMemo } from 'react';
import {
  Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts } from '../constants/theme';
import { DEFAULT_ROUTINE, ROUTINE_BLOCKS, RULING_LABEL, Ruling } from '../constants/routine';

interface Props {
  visible: boolean;
  doneIds: string[];
  onToggle: (id: string) => void;
  onClose: () => void;
}

const RULING_STYLE: Record<Ruling, { color: string; bg: string }> = {
  fard:        { color: '#6FBF9A', bg: 'rgba(111,191,154,0.14)' },
  sunnah:      { color: colors.gold, bg: 'rgba(201,168,76,0.14)' },
  nafl:        { color: '#7FA8C9', bg: 'rgba(127,168,201,0.14)' },
  recommended: { color: '#9AA7B2', bg: 'rgba(154,167,178,0.14)' },
};

function todayLabel() {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
}

const RING = 60;
const R = 26;
const CIRC = 2 * Math.PI * R;

export default function MyDayModal({ visible, doneIds, onToggle, onClose }: Props) {
  const done = useMemo(() => new Set(doneIds), [doneIds]);
  const total = DEFAULT_ROUTINE.length;
  const completed = DEFAULT_ROUTINE.filter(i => done.has(i.id)).length;
  const offset = CIRC * (1 - (total ? completed / total : 0));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>My Day</Text>
              <Text style={styles.subtitle}>{todayLabel()}</Text>
            </View>
            <View style={styles.ring}>
              <Svg width={RING} height={RING} style={styles.ringSvg}>
                <Circle cx={RING / 2} cy={RING / 2} r={R} stroke="rgba(255,255,255,0.08)" strokeWidth={3.5} fill="none" />
                <Circle
                  cx={RING / 2} cy={RING / 2} r={R} stroke={colors.gold} strokeWidth={3.5} fill="none"
                  strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={offset}
                />
              </Svg>
              <View style={styles.ringNum}>
                <Text style={styles.ringDone}>{completed}</Text>
                <Text style={styles.ringTotal}>of {total}</Text>
              </View>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={styles.scrollContent}>
            {ROUTINE_BLOCKS.map(block => {
              const items = DEFAULT_ROUTINE.filter(i => i.block === block.key);
              if (items.length === 0) return null;
              return (
                <View key={block.key} style={styles.block}>
                  <View style={styles.blockHead}>
                    <View style={styles.node} />
                    <Text style={styles.blockLabel}>{block.label}</Text>
                  </View>
                  <View style={styles.items}>
                    {items.map(item => {
                      const isDone = done.has(item.id);
                      const rs = RULING_STYLE[item.ruling];
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[styles.item, isDone && styles.itemDone]}
                          onPress={() => onToggle(item.id)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.check, isDone && styles.checkDone]}>
                            {isDone && <Text style={styles.checkMark}>✓</Text>}
                          </View>
                          <View style={styles.itemMain}>
                            <Text style={[styles.itemTitle, isDone && styles.itemTitleDone]}>{item.title}</Text>
                            {!!item.sub && <Text style={styles.itemSub}>{item.sub}</Text>}
                          </View>
                          <View style={[styles.badge, { backgroundColor: rs.bg }]}>
                            <Text style={[styles.badgeText, { color: rs.color }]}>{RULING_LABEL[item.ruling]}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}

            <Text style={styles.footNote}>
              Consistency over volume — the most beloved deeds are the steady ones, even if few.
            </Text>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(13,31,26,0.85)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#162032', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24,
    borderTopWidth: 1, borderTopColor: colors.goldDim, maxHeight: '90%',
  },
  handle: { width: 36, height: 4, backgroundColor: colors.muted2, borderRadius: 2, alignSelf: 'center', marginBottom: 14 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, color: colors.white, fontFamily: fonts.uiBold, marginBottom: 3 },
  subtitle: { fontSize: 12, color: colors.muted, fontFamily: fonts.ui },

  ring: { width: RING, height: RING, alignItems: 'center', justifyContent: 'center' },
  ringSvg: { position: 'absolute', transform: [{ rotate: '-90deg' }] },
  ringNum: { alignItems: 'center', justifyContent: 'center' },
  ringDone: { fontSize: 16, color: colors.white, fontFamily: fonts.uiBold, lineHeight: 18 },
  ringTotal: { fontSize: 9, color: colors.muted, fontFamily: fonts.ui },

  scrollContent: { paddingBottom: 8 },

  block: { marginBottom: 18 },
  blockHead: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 },
  node: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold },
  blockLabel: {
    fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase',
    color: colors.gold, fontFamily: fonts.uiBold,
  },
  items: { gap: 8, paddingLeft: 17 },

  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(201,168,76,0.06)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.14)',
    borderRadius: 13, paddingVertical: 12, paddingHorizontal: 13,
  },
  itemDone: { backgroundColor: 'rgba(111,191,154,0.07)', borderColor: 'rgba(111,191,154,0.2)' },
  check: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 1.6, borderColor: colors.muted,
    alignItems: 'center', justifyContent: 'center',
  },
  checkDone: { backgroundColor: '#6FBF9A', borderColor: '#6FBF9A' },
  checkMark: { fontSize: 12, color: colors.bg, fontFamily: fonts.uiBold, lineHeight: 14 },
  itemMain: { flex: 1, minWidth: 0 },
  itemTitle: { fontSize: 14.5, color: colors.white, fontFamily: fonts.uiBold },
  itemTitleDone: { color: colors.muted },
  itemSub: { fontSize: 11, color: colors.muted, fontFamily: fonts.ui, marginTop: 2 },

  badge: { borderRadius: 6, paddingVertical: 3, paddingHorizontal: 7 },
  badgeText: { fontSize: 9, letterSpacing: 0.4, textTransform: 'uppercase', fontFamily: fonts.uiBold },

  footNote: {
    fontSize: 11.5, color: colors.muted, fontFamily: fonts.ui, fontStyle: 'italic',
    textAlign: 'center', lineHeight: 17, marginTop: 6, paddingHorizontal: 16,
  },
});
