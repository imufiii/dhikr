import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts } from '../constants/theme';
import {
  DEFAULT_ROUTINE, ROUTINE_BLOCKS, RULING_LABEL, Ruling, RoutineItem,
} from '../constants/routine';

interface Props {
  visible: boolean;
  doneIds: string[];
  disabledIds: string[];
  customItems: RoutineItem[];
  onToggle: (id: string) => void;
  onToggleEnabled: (id: string) => void;
  onAddItem: (item: RoutineItem) => void;
  onRemoveCustom: (id: string) => void;
  onClose: () => void;
}

const RULING_STYLE: Record<Ruling, { color: string; bg: string }> = {
  fard:        { color: '#6FBF9A', bg: 'rgba(111,191,154,0.14)' },
  sunnah:      { color: colors.gold, bg: 'rgba(201,168,76,0.14)' },
  nafl:        { color: '#7FA8C9', bg: 'rgba(127,168,201,0.14)' },
  recommended: { color: '#9AA7B2', bg: 'rgba(154,167,178,0.14)' },
};
const RULINGS: Ruling[] = ['fard', 'sunnah', 'nafl', 'recommended'];

function todayLabel() {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
}

const RING = 60;
const R = 26;
const CIRC = 2 * Math.PI * R;

export default function MyDayModal({
  visible, doneIds, disabledIds, customItems,
  onToggle, onToggleEnabled, onAddItem, onRemoveCustom, onClose,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [sub, setSub] = useState('');
  const [block, setBlock] = useState(ROUTINE_BLOCKS[0].key);
  const [ruling, setRuling] = useState<Ruling>('sunnah');

  const done = useMemo(() => new Set(doneIds), [doneIds]);
  const disabled = useMemo(() => new Set(disabledIds), [disabledIds]);
  const customIds = useMemo(() => new Set(customItems.map(i => i.id)), [customItems]);
  const allItems = useMemo(() => [...DEFAULT_ROUTINE, ...customItems], [customItems]);

  const total = allItems.filter(i => !disabled.has(i.id)).length;
  const completed = allItems.filter(i => !disabled.has(i.id) && done.has(i.id)).length;
  const offset = CIRC * (1 - (total ? completed / total : 0));

  const submitAdd = () => {
    const t = title.trim();
    if (!t) return;
    onAddItem({ id: `c_${Date.now()}`, title: t, sub: sub.trim() || undefined, block, ruling });
    setTitle(''); setSub(''); setBlock(ROUTINE_BLOCKS[0].key); setRuling('sunnah');
    setAdding(false);
  };

  const exitEdit = () => { setEditing(false); setAdding(false); };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>My Day</Text>
                <Text style={styles.subtitle}>{todayLabel()}</Text>
              </View>
              {!editing && (
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
              )}
            </View>

            <TouchableOpacity
              style={styles.editToggle}
              onPress={() => (editing ? exitEdit() : setEditing(true))}
              activeOpacity={0.7}
            >
              <Text style={styles.editToggleText}>{editing ? '✓ Done' : '✎ Edit routine'}</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} bounces={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
              {ROUTINE_BLOCKS.map(blk => {
                const items = allItems.filter(i => i.block === blk.key && (editing || !disabled.has(i.id)));
                if (items.length === 0) return null;
                return (
                  <View key={blk.key} style={styles.block}>
                    <View style={styles.blockHead}>
                      <View style={styles.node} />
                      <Text style={styles.blockLabel}>{blk.label}</Text>
                    </View>
                    <View style={styles.items}>
                      {items.map(item => {
                        const isDone = done.has(item.id);
                        const isDisabled = disabled.has(item.id);
                        const isCustom = customIds.has(item.id);
                        const rs = RULING_STYLE[item.ruling];
                        return (
                          <View
                            key={item.id}
                            style={[styles.item, isDone && !editing && styles.itemDone, isDisabled && styles.itemHidden]}
                          >
                            {editing ? (
                              isCustom ? (
                                <TouchableOpacity style={[styles.ctrl, styles.ctrlDelete]} onPress={() => onRemoveCustom(item.id)}>
                                  <Text style={styles.ctrlDeleteText}>✕</Text>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  style={[styles.ctrl, isDisabled ? styles.ctrlAdd : styles.ctrlHide]}
                                  onPress={() => onToggleEnabled(item.id)}
                                >
                                  <Text style={isDisabled ? styles.ctrlAddText : styles.ctrlHideText}>{isDisabled ? '＋' : '－'}</Text>
                                </TouchableOpacity>
                              )
                            ) : (
                              <TouchableOpacity
                                style={[styles.check, isDone && styles.checkDone]}
                                onPress={() => onToggle(item.id)}
                                activeOpacity={0.7}
                              >
                                {isDone && <Text style={styles.checkMark}>✓</Text>}
                              </TouchableOpacity>
                            )}

                            <TouchableOpacity
                              style={styles.itemMain}
                              activeOpacity={editing ? 1 : 0.7}
                              onPress={() => { if (!editing) onToggle(item.id); }}
                            >
                              <Text style={[styles.itemTitle, isDone && !editing && styles.itemTitleDone]}>{item.title}</Text>
                              {!!item.sub && <Text style={styles.itemSub}>{item.sub}</Text>}
                            </TouchableOpacity>

                            <View style={[styles.badge, { backgroundColor: rs.bg }]}>
                              <Text style={[styles.badgeText, { color: rs.color }]}>{RULING_LABEL[item.ruling]}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}

              {editing && !adding && (
                <TouchableOpacity style={styles.addBtn} onPress={() => setAdding(true)} activeOpacity={0.7}>
                  <Text style={styles.addBtnText}>＋ Add to my routine</Text>
                </TouchableOpacity>
              )}

              {editing && adding && (
                <View style={styles.addForm}>
                  <Text style={styles.formLabel}>New item</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Title, e.g. Recite Al-Waqiʿah"
                    placeholderTextColor={colors.muted}
                    value={title}
                    onChangeText={setTitle}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Detail (optional), e.g. 2 rakʿah"
                    placeholderTextColor={colors.muted}
                    value={sub}
                    onChangeText={setSub}
                  />

                  <Text style={styles.formSub}>When</Text>
                  <View style={styles.pickRow}>
                    {ROUTINE_BLOCKS.map(b => (
                      <TouchableOpacity
                        key={b.key}
                        style={[styles.pick, block === b.key && styles.pickActive]}
                        onPress={() => setBlock(b.key)}
                      >
                        <Text style={[styles.pickText, block === b.key && styles.pickTextActive]}>{b.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.formSub}>Ruling</Text>
                  <View style={styles.pickRow}>
                    {RULINGS.map(r => (
                      <TouchableOpacity
                        key={r}
                        style={[styles.pick, ruling === r && styles.pickActive]}
                        onPress={() => setRuling(r)}
                      >
                        <Text style={[styles.pickText, ruling === r && styles.pickTextActive]}>{RULING_LABEL[r]}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.formActions}>
                    <TouchableOpacity style={[styles.formBtn, styles.formCancel]} onPress={() => setAdding(false)}>
                      <Text style={styles.formCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.formBtn, styles.formSave, !title.trim() && styles.formSaveDisabled]}
                      onPress={submitAdd}
                    >
                      <Text style={styles.formSaveText}>Add item</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {!editing && (
                <Text style={styles.footNote}>
                  Consistency over volume — the most beloved deeds are the steady ones, even if few.
                </Text>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, color: colors.white, fontFamily: fonts.uiBold, marginBottom: 3 },
  subtitle: { fontSize: 12, color: colors.muted, fontFamily: fonts.ui },

  ring: { width: RING, height: RING, alignItems: 'center', justifyContent: 'center' },
  ringSvg: { position: 'absolute', transform: [{ rotate: '-90deg' }] },
  ringNum: { alignItems: 'center', justifyContent: 'center' },
  ringDone: { fontSize: 16, color: colors.white, fontFamily: fonts.uiBold, lineHeight: 18 },
  ringTotal: { fontSize: 9, color: colors.muted, fontFamily: fonts.ui },

  editToggle: { alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 4, marginTop: 2, marginBottom: 6 },
  editToggleText: { fontSize: 12.5, color: colors.gold, fontFamily: fonts.uiBold },

  scrollContent: { paddingBottom: 8 },

  block: { marginBottom: 18 },
  blockHead: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 },
  node: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold },
  blockLabel: { fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: colors.gold, fontFamily: fonts.uiBold },
  items: { gap: 8, paddingLeft: 17 },

  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(201,168,76,0.06)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.14)',
    borderRadius: 13, paddingVertical: 12, paddingHorizontal: 13,
  },
  itemDone: { backgroundColor: 'rgba(111,191,154,0.07)', borderColor: 'rgba(111,191,154,0.2)' },
  itemHidden: { opacity: 0.5 },

  check: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 1.6, borderColor: colors.muted,
    alignItems: 'center', justifyContent: 'center',
  },
  checkDone: { backgroundColor: '#6FBF9A', borderColor: '#6FBF9A' },
  checkMark: { fontSize: 12, color: colors.bg, fontFamily: fonts.uiBold, lineHeight: 14 },

  ctrl: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  ctrlHide: { backgroundColor: 'rgba(245,240,232,0.1)' },
  ctrlHideText: { fontSize: 16, color: colors.white, lineHeight: 18 },
  ctrlAdd: { backgroundColor: 'rgba(201,168,76,0.25)' },
  ctrlAddText: { fontSize: 15, color: colors.gold, lineHeight: 17, fontFamily: fonts.uiBold },
  ctrlDelete: { backgroundColor: 'rgba(239,68,68,0.2)' },
  ctrlDeleteText: { fontSize: 12, color: '#F5F0E8', lineHeight: 14 },

  itemMain: { flex: 1, minWidth: 0 },
  itemTitle: { fontSize: 14.5, color: colors.white, fontFamily: fonts.uiBold },
  itemTitleDone: { color: colors.muted },
  itemSub: { fontSize: 11, color: colors.muted, fontFamily: fonts.ui, marginTop: 2 },

  badge: { borderRadius: 6, paddingVertical: 3, paddingHorizontal: 7 },
  badgeText: { fontSize: 9, letterSpacing: 0.4, textTransform: 'uppercase', fontFamily: fonts.uiBold },

  addBtn: {
    borderWidth: 1, borderColor: colors.goldDim, borderStyle: 'dashed', borderRadius: 13,
    paddingVertical: 13, alignItems: 'center', marginTop: 2,
  },
  addBtnText: { fontSize: 12.5, color: colors.gold, fontFamily: fonts.uiBold },

  addForm: {
    backgroundColor: 'rgba(201,168,76,0.06)', borderWidth: 1, borderColor: colors.goldDim,
    borderRadius: 14, padding: 14, gap: 10,
  },
  formLabel: { fontSize: 13, color: colors.white, fontFamily: fonts.uiBold },
  formSub: { fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: colors.gold, fontFamily: fonts.uiBold, marginTop: 2 },
  input: {
    backgroundColor: colors.muted2, borderWidth: 1, borderColor: colors.goldDim, color: colors.white,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13, fontFamily: fonts.ui,
  },
  pickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  pick: {
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)', borderRadius: 16,
    paddingVertical: 6, paddingHorizontal: 11, backgroundColor: 'rgba(201,168,76,0.06)',
  },
  pickActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  pickText: { fontSize: 11.5, color: colors.white, fontFamily: fonts.ui },
  pickTextActive: { color: colors.bg, fontFamily: fonts.uiBold },
  formActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  formBtn: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center' },
  formCancel: { backgroundColor: 'rgba(245,240,232,0.08)' },
  formCancelText: { fontSize: 12.5, color: colors.white, fontFamily: fonts.uiBold },
  formSave: { backgroundColor: colors.gold },
  formSaveDisabled: { opacity: 0.4 },
  formSaveText: { fontSize: 12.5, color: colors.bg, fontFamily: fonts.uiBold },

  footNote: {
    fontSize: 11.5, color: colors.muted, fontFamily: fonts.ui, fontStyle: 'italic',
    textAlign: 'center', lineHeight: 17, marginTop: 6, paddingHorizontal: 16,
  },
});
