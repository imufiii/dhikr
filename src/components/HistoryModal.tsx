import { useMemo } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { last7Days } from '../store/dhikrStore';
import { CustomPhrase } from '../store/dhikrStore';
import { PHRASES } from '../constants/phrases';

interface Props {
  visible: boolean;
  dailyTotals: Record<string, number>;
  phraseTotals: Record<string, number>;
  todayCount: number;
  todayDate: string;
  customPhrases: CustomPhrase[];
  onClose: () => void;
}

export default function HistoryModal({
  visible, dailyTotals, phraseTotals, todayCount, todayDate, customPhrases, onClose,
}: Props) {
  const weekData = useMemo(() => {
    const live = { ...dailyTotals, [todayDate]: todayCount };
    const days = last7Days();
    const counts = days.map(d => live[d.dateStr] ?? 0);
    const max = Math.max(...counts, 1);
    return days.map((d, i) => ({
      ...d,
      count: counts[i],
      pct: counts[i] / max,
      isToday: d.dateStr === todayDate,
    }));
  }, [dailyTotals, todayCount, todayDate]);

  const weekTotal = weekData.reduce((s, d) => s + d.count, 0);

  const allPhrases = useMemo(() => [...PHRASES, ...customPhrases], [customPhrases]);

  const phraseRows = useMemo(() => {
    const rows = allPhrases
      .map(p => ({ ar: p.ar, ro: p.ro, total: phraseTotals[p.ro] ?? 0 }))
      .filter(r => r.total > 0)
      .sort((a, b) => b.total - a.total);
    return rows;
  }, [allPhrases, phraseTotals]);

  const allTimeTotal = useMemo(
    () => Object.values(phraseTotals).reduce((s, n) => s + n, 0),
    [phraseTotals]
  );

  const maxPhrase = phraseRows[0]?.total ?? 1;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Weekly chart */}
            <View style={styles.section}>
              <View style={styles.rowHeader}>
                <Text style={styles.label}>This week</Text>
                <Text style={styles.label}>{weekTotal.toLocaleString()}</Text>
              </View>
              {weekData.map(({ dateStr, weekday, count, pct, isToday }) => (
                <View key={dateStr} style={styles.barRow}>
                  <Text style={[styles.day, isToday && styles.gold]}>{weekday}</Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { flex: pct || 0.001 }, isToday && styles.barGold]} />
                    <View style={{ flex: Math.max(1 - pct, 0) }} />
                  </View>
                  <Text style={[styles.dayCount, isToday && styles.gold]}>
                    {count > 0 ? count.toLocaleString() : '—'}
                  </Text>
                </View>
              ))}
            </View>

            {/* All-time per phrase */}
            {phraseRows.length > 0 && (
              <View style={styles.section}>
                <View style={styles.rowHeader}>
                  <Text style={styles.label}>All time</Text>
                  <Text style={styles.label}>{allTimeTotal.toLocaleString()}</Text>
                </View>
                {phraseRows.map(({ ar, ro, total }) => (
                  <View key={ro} style={styles.phraseRow}>
                    <View style={styles.phraseLeft}>
                      <Text style={styles.arabic}>{ar}</Text>
                    </View>
                    <View style={styles.phraseMid}>
                      <View style={styles.barBg}>
                        <View style={[styles.barFill, styles.barGold, { flex: total / maxPhrase }]} />
                        <View style={{ flex: 1 - total / maxPhrase }} />
                      </View>
                    </View>
                    <Text style={styles.phraseCount}>{total.toLocaleString()}</Text>
                  </View>
                ))}
              </View>
            )}

            {phraseRows.length === 0 && (
              <Text style={styles.empty}>Complete a session to see your totals</Text>
            )}
          </ScrollView>
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
    maxHeight: '80%',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.muted2,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
    gap: 8,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: fonts.ui,
  },
  // Weekly bars
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 22,
  },
  day: {
    fontSize: 11,
    color: colors.muted,
    width: 30,
    fontFamily: fonts.ui,
  },
  barBg: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.muted2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  barFill: {
    backgroundColor: colors.muted,
    borderRadius: 3,
  },
  barGold: {
    backgroundColor: colors.gold,
  },
  dayCount: {
    fontSize: 11,
    color: colors.muted,
    width: 48,
    textAlign: 'right',
    fontFamily: fonts.ui,
  },
  gold: {
    color: colors.gold,
  },
  // Per-phrase rows
  phraseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 36,
  },
  phraseLeft: {
    width: 120,
  },
  arabic: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fonts.arabic,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  phraseMid: {
    flex: 1,
  },
  phraseCount: {
    fontSize: 13,
    color: colors.muted,
    width: 52,
    textAlign: 'right',
    fontFamily: fonts.ui,
  },
  empty: {
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: 32,
    fontSize: 13,
    fontFamily: fonts.ui,
  },
});
