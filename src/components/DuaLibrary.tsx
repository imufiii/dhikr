import React, { useState, useMemo } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { colors, fonts } from '../constants/theme';
import { UserDua } from '../constants/universalDuas';

interface Props {
  visible: boolean;
  duas: UserDua[];
  removedCount: number;
  onAddPress: () => void;
  onEdit: (dua: UserDua) => void;
  onDelete: (id: string) => void;
  onRestoreBuiltIns: () => void;
  onClose: () => void;
}

// Collection display: an emoji face + a friendly label per category.
const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  'Morning & Evening': { label: 'Morning & Evening', icon: '🌅' },
  'Prayer':            { label: 'Prayer',            icon: '🕌' },
  'Sleep':             { label: 'Sleep',             icon: '🌙' },
  'Purification':      { label: 'Purification',      icon: '💧' },
  'Daily':             { label: 'Daily Life',        icon: '🏠' },
  'Forgiveness':       { label: 'Forgiveness',       icon: '🤲' },
  'Reliance':          { label: 'Reliance',          icon: '🕊️' },
  'Distress':          { label: 'Distress',          icon: '💛' },
};
const CATEGORY_ORDER = Object.keys(CATEGORY_META);

function meta(category: string) {
  return CATEGORY_META[category] || { label: category || 'Custom', icon: '📿' };
}

function arabicSnippet(text: string) {
  const words = text.trim().split(/\s+/);
  return words.slice(0, 2).join(' ');
}

// The "dua of the moment": pick a fitting dua from what the user still has,
// based on the time of day (approximates the prayer-time rhythm, offline).
function pickFeatured(duas: UserDua[]): { dua: UserDua; label: string; icon: string } | null {
  if (duas.length === 0) return null;
  const hour = new Date().getHours();
  let candidates: string[]; let label: string; let icon: string;
  if (hour >= 4 && hour < 11)       { candidates = ['dua_morning'];                              label = 'For this morning'; icon = '🌅'; }
  else if (hour >= 11 && hour < 16) { candidates = ['dua_istighfar', 'universal_1'];             label = 'This afternoon';   icon = '☀️'; }
  else if (hour >= 16 && hour < 19) { candidates = ['dua_evening'];                              label = 'This evening';     icon = '🌇'; }
  else if (hour >= 19 && hour < 22) { candidates = ['dua_istighfar', 'dua_evening'];             label = 'After Maghrib';    icon = '🌆'; }
  else                              { candidates = ['dua_mulk', 'universal_1_sleep', 'dua_night_waking']; label = 'Before sleep'; icon = '🌙'; }

  let dua: UserDua | undefined;
  for (const id of candidates) { dua = duas.find(d => d.id === id); if (dua) break; }
  if (!dua) dua = duas.find(d => d.isBuiltIn) || duas[0];
  return dua ? { dua, label, icon } : null;
}

export default function DuaLibrary({ visible, duas, removedCount, onAddPress, onEdit, onDelete, onRestoreBuiltIns, onClose }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [collection, setCollection] = useState<string>('all');
  const [featureOpen, setFeatureOpen] = useState(false);

  const featured = useMemo(() => pickFeatured(duas), [duas]);
  const showFeature = collection === 'all' && !searchQuery.trim() && !!featured;

  // Collection chips, derived from the categories actually present (stable counts).
  const collections = useMemo(() => {
    const counts: Record<string, number> = {};
    duas.forEach(d => { counts[d.category] = (counts[d.category] || 0) + 1; });
    return Object.keys(counts)
      .sort((a, b) => {
        const ia = CATEGORY_ORDER.indexOf(a); const ib = CATEGORY_ORDER.indexOf(b);
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      })
      .map(c => ({ key: c, count: counts[c], ...meta(c) }));
  }, [duas]);

  const visibleDuas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return duas.filter(d => {
      if (collection !== 'all' && d.category !== collection) return false;
      if (!q) return true;
      return d.arabicText.includes(searchQuery)
        || d.transliteration.toLowerCase().includes(q)
        || d.englishMeaning.toLowerCase().includes(q)
        || d.source.toLowerCase().includes(q)
        || (d.title || '').toLowerCase().includes(q);
    });
  }, [duas, collection, searchQuery]);

  const Row = ({ dua }: { dua: UserDua }) => {
    const isExpanded = expandedId === dua.id;
    const { icon } = meta(dua.category);
    return (
      <View style={[styles.row, isExpanded && styles.rowOpen]}>
        <TouchableOpacity
          style={styles.rowHead}
          onPress={() => setExpandedId(isExpanded ? null : dua.id)}
          activeOpacity={0.7}
        >
          <View style={styles.iconChip}><Text style={styles.iconEmoji}>{icon}</Text></View>
          <View style={styles.rowMid}>
            <Text style={styles.rowTitle} numberOfLines={1}>{dua.title || dua.source}</Text>
            {!!dua.englishMeaning && (
              <Text style={styles.rowMeaning} numberOfLines={1}>{dua.englishMeaning}</Text>
            )}
          </View>
          {isExpanded
            ? <Text style={styles.chev}>▾</Text>
            : <Text style={styles.rowArabic} numberOfLines={1}>{arabicSnippet(dua.arabicText)}</Text>}
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expanded}>
            <Text style={styles.arabicFull}>{dua.arabicText}</Text>
            {!!dua.transliteration && <Text style={styles.translit}>{dua.transliteration}</Text>}
            {!!dua.englishMeaning && <Text style={styles.meaning}>{dua.englishMeaning}</Text>}
            {!!dua.source && <Text style={styles.src}>— {dua.source}</Text>}
            <View style={styles.actions}>
              {!dua.isBuiltIn && (
                <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={() => onEdit(dua)}>
                  <Text style={styles.actionBtnText}>✎ Edit</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => onDelete(dua.id)}>
                <Text style={styles.actionBtnText}>✕ Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  const Chip = ({ label, icon, count, value }: { label: string; icon?: string; count: number; value: string }) => {
    const active = collection === value;
    return (
      <TouchableOpacity
        style={[styles.chip, active && styles.chipActive]}
        onPress={() => setCollection(value)}
        activeOpacity={0.7}
      >
        {!!icon && <Text style={styles.chipIcon}>{icon}</Text>}
        <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
        <Text style={[styles.chipCount, active && styles.chipCountActive]}>{count}</Text>
      </TouchableOpacity>
    );
  };

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
              <View>
                <Text style={styles.title}>Duas</Text>
                <Text style={styles.subtitle}>{duas.length} saved · Sunnah &amp; Qur’an</Text>
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={onAddPress} activeOpacity={0.7}>
                <Text style={styles.addBtnText}>＋ Add</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search duas…"
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.chipsWrap}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.chipsContent}
              >
                <Chip label="All" count={duas.length} value="all" />
                {collections.map(c => (
                  <Chip key={c.key} label={c.label} icon={c.icon} count={c.count} value={c.key} />
                ))}
              </ScrollView>
            </View>

            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {showFeature && featured && (
                <TouchableOpacity
                  style={styles.feature}
                  activeOpacity={0.85}
                  onPress={() => setFeatureOpen(o => !o)}
                >
                  <Text style={styles.feEyebrow}>{featured.icon}  {featured.label.toUpperCase()}</Text>
                  <Text style={styles.feArabic} numberOfLines={featureOpen ? undefined : 2}>
                    {featured.dua.arabicText}
                  </Text>
                  {featureOpen && !!featured.dua.transliteration && (
                    <Text style={styles.feTranslit}>{featured.dua.transliteration}</Text>
                  )}
                  <Text style={styles.feTitle}>{featured.dua.title || featured.dua.source}</Text>
                  {!!featured.dua.englishMeaning && (
                    <Text style={styles.feMean} numberOfLines={featureOpen ? undefined : 2}>
                      {featured.dua.englishMeaning}
                    </Text>
                  )}
                  <View style={styles.feFoot}>
                    {!!featured.dua.source && <Text style={styles.srcTag}>{featured.dua.source}</Text>}
                    <Text style={styles.readBtn}>{featureOpen ? 'Show less ▴' : 'Read →'}</Text>
                  </View>
                </TouchableOpacity>
              )}

              {visibleDuas.map(dua => <Row key={dua.id} dua={dua} />)}

              {visibleDuas.length === 0 && (
                <Text style={styles.empty}>
                  {duas.length === 0 ? 'No duas yet. Add your first one!' : 'No duas in this collection.'}
                </Text>
              )}

              {removedCount > 0 && (
                <TouchableOpacity style={styles.restoreBtn} onPress={onRestoreBuiltIns} activeOpacity={0.7}>
                  <Text style={styles.restoreBtnText}>↺ Restore built-in duas ({removedCount})</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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
    flex: 1,
    backgroundColor: '#162032',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: colors.goldDim,
    maxHeight: '90%',
  },
  handle: {
    width: 36, height: 4, backgroundColor: colors.muted2, borderRadius: 2,
    alignSelf: 'center', marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14,
  },
  title: { fontSize: 24, color: colors.white, fontFamily: fonts.uiBold, marginBottom: 3 },
  subtitle: { fontSize: 12, color: colors.muted, fontFamily: fonts.ui },
  addBtn: { backgroundColor: colors.gold, borderRadius: 11, paddingVertical: 9, paddingHorizontal: 16 },
  addBtnText: { fontSize: 13, color: colors.bg, fontFamily: fonts.uiBold },

  searchInput: {
    backgroundColor: colors.muted2, borderWidth: 1, borderColor: colors.goldDim, color: colors.white,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, fontFamily: fonts.ui,
    marginBottom: 12,
  },

  chipsWrap: { marginBottom: 12 },
  chipsContent: { gap: 8, paddingRight: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(201,168,76,0.08)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.16)',
    borderRadius: 20, paddingVertical: 7, paddingHorizontal: 12,
  },
  chipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipIcon: { fontSize: 13 },
  chipText: { fontSize: 12.5, color: colors.white, fontFamily: fonts.uiBold },
  chipTextActive: { color: colors.bg },
  chipCount: { fontSize: 11, color: colors.muted, fontFamily: fonts.ui },
  chipCountActive: { color: 'rgba(17,24,39,0.6)' },

  list: { flex: 1 },
  listContent: { gap: 9, paddingBottom: 8 },

  feature: {
    backgroundColor: 'rgba(201,168,76,0.13)',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.32)',
    borderRadius: 18, padding: 16, marginBottom: 4,
  },
  feEyebrow: {
    fontSize: 10.5, letterSpacing: 1, color: colors.gold, fontFamily: fonts.uiBold, marginBottom: 10,
  },
  feArabic: {
    fontSize: 19, color: colors.gold, fontFamily: fonts.arabic, textAlign: 'right', lineHeight: 32,
  },
  feTranslit: {
    fontSize: 11, color: colors.muted, fontFamily: fonts.ui, fontStyle: 'italic', lineHeight: 16, marginTop: 8,
  },
  feTitle: {
    fontSize: 17, color: colors.white, fontFamily: fonts.uiBold, marginTop: 10, marginBottom: 4,
  },
  feMean: { fontSize: 12.5, color: 'rgba(245,240,232,0.72)', fontFamily: fonts.ui, lineHeight: 18 },
  feFoot: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14,
  },
  srcTag: {
    fontSize: 10, color: colors.muted, fontFamily: fonts.ui,
    borderWidth: 1, borderColor: colors.muted2, borderRadius: 20, paddingVertical: 3, paddingHorizontal: 10,
  },
  readBtn: {
    fontSize: 12.5, color: colors.bg, fontFamily: fonts.uiBold,
    backgroundColor: colors.gold, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, overflow: 'hidden',
  },

  row: {
    backgroundColor: 'rgba(201,168,76,0.06)', borderRadius: 15,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.14)', overflow: 'hidden',
  },
  rowOpen: { backgroundColor: 'rgba(201,168,76,0.1)', borderColor: 'rgba(201,168,76,0.3)' },
  rowHead: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 13 },
  iconChip: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(201,168,76,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  iconEmoji: { fontSize: 18 },
  rowMid: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 14.5, color: colors.white, fontFamily: fonts.uiBold },
  rowMeaning: { fontSize: 11.5, color: colors.muted, fontFamily: fonts.ui, marginTop: 2 },
  rowArabic: {
    fontSize: 15, color: 'rgba(201,168,76,0.85)', fontFamily: fonts.arabic,
    maxWidth: 92, textAlign: 'right', marginLeft: 8,
  },
  chev: { fontSize: 13, color: colors.gold, marginLeft: 8 },

  expanded: {
    borderTopWidth: 1, borderTopColor: 'rgba(201,168,76,0.12)',
    paddingVertical: 13, paddingHorizontal: 14, gap: 8,
    backgroundColor: 'rgba(201,168,76,0.04)',
  },
  arabicFull: { fontSize: 18, color: colors.gold, fontFamily: fonts.arabic, textAlign: 'right', lineHeight: 30 },
  translit: { fontSize: 11, color: colors.muted, fontFamily: fonts.ui, fontStyle: 'italic', lineHeight: 16 },
  meaning: { fontSize: 12.5, color: 'rgba(245,240,232,0.72)', fontFamily: fonts.ui, lineHeight: 18 },
  src: { fontSize: 10.5, color: colors.muted, fontFamily: fonts.ui, marginTop: 2 },

  actions: { flexDirection: 'row', gap: 8, marginTop: 6 },
  actionBtn: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },
  editBtn: { backgroundColor: 'rgba(201,168,76,0.28)' },
  deleteBtn: { backgroundColor: 'rgba(239,68,68,0.18)' },
  actionBtnText: { fontSize: 11.5, color: colors.white, fontFamily: fonts.uiBold },

  empty: { color: colors.muted, fontSize: 13, textAlign: 'center', paddingVertical: 40, fontFamily: fonts.ui },

  restoreBtn: {
    borderWidth: 1, borderColor: colors.goldDim, borderRadius: 12,
    paddingVertical: 12, alignItems: 'center', marginTop: 6,
  },
  restoreBtnText: { fontSize: 12.5, color: colors.gold, fontFamily: fonts.uiBold },
});
