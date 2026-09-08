import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { colors, fonts } from '../constants/theme';
import { DailyDuaRecord } from '../store/dhikrStore';
import { SITUATIONS } from '../constants/duas';

interface Props {
  dua: DailyDuaRecord | null | undefined;
  onChangeClick: () => void;
}

export default function DailyDuaCard({ dua, onChangeClick }: Props) {
  if (!dua) {
    return (
      <TouchableOpacity style={styles.emptyCard} onPress={onChangeClick} activeOpacity={0.7}>
        <Text style={styles.emptyEmoji}>🤲</Text>
        <Text style={styles.emptyLabel}>Choose Today's Dua</Text>
        <Text style={styles.emptyHint}>Select a situation to find the right dua</Text>
      </TouchableOpacity>
    );
  }

  const situation = SITUATIONS.find(s => s.id === dua.situation);
  const recitedCount = dua.timesRecited || 0;
  const goalRecitations = 33; // Can be made configurable

  return (
    <TouchableOpacity style={styles.card} onPress={onChangeClick} activeOpacity={0.75}>
      <View style={styles.header}>
        <View style={styles.situation}>
          <Text style={styles.situationEmoji}>{situation?.emoji}</Text>
          <View style={styles.situationText}>
            <Text style={styles.situationLabel}>{situation?.label}</Text>
            <Text style={styles.recitedCount}>{recitedCount} of {goalRecitations} times today</Text>
          </View>
        </View>
        <Text style={styles.changeIcon}>›</Text>
      </View>

      <View style={styles.duaBody}>
        <Text style={styles.arabicText}>{dua.arabicText}</Text>
        <Text style={styles.transliteration}>{dua.transliteration}</Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min((recitedCount / goalRecitations) * 100, 100)}%` },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.25)',
    marginBottom: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  situation: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  situationEmoji: {
    fontSize: 24,
  },
  situationText: {
    flex: 1,
  },
  situationLabel: {
    fontSize: 13,
    color: colors.gold,
    fontFamily: fonts.uiBold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  recitedCount: {
    fontSize: 11,
    color: colors.muted,
    fontFamily: fonts.ui,
    marginTop: 2,
  },
  changeIcon: {
    fontSize: 20,
    color: colors.gold,
    fontWeight: '600',
  },
  duaBody: {
    gap: 6,
  },
  arabicText: {
    fontSize: 18,
    color: colors.gold,
    fontFamily: fonts.arabic,
    textAlign: 'right',
    lineHeight: 28,
  },
  transliteration: {
    fontSize: 10,
    color: colors.muted,
    fontFamily: fonts.ui,
    fontStyle: 'italic',
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(201,168,76,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold,
  },
  emptyCard: {
    backgroundColor: 'rgba(201,168,76,0.08)',
    borderRadius: 18,
    padding: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(201,168,76,0.25)',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  emptyLabel: {
    fontSize: 14,
    color: colors.white,
    fontFamily: fonts.uiBold,
  },
  emptyHint: {
    fontSize: 11,
    color: colors.muted,
    fontFamily: fonts.ui,
    textAlign: 'center',
  },
});
