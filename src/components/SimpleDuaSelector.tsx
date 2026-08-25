import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { colors, fonts } from '../constants/theme';
import { UserDua } from '../constants/universalDuas';

interface Props {
  duas: UserDua[];
  selectedId: string | null;
  onLibraryPress: () => void;
}

export default function SimpleDuaSelector({ duas, selectedId, onLibraryPress }: Props) {
  const selectedDua = duas.find(d => d.id === selectedId);

  return (
    <View style={styles.container}>
      {selectedDua ? (
        <View style={styles.activeCard}>
          <Text style={styles.activeLabel}>Today's Dua</Text>
          <Text style={styles.arabicText}>{selectedDua.arabicText}</Text>
          {selectedDua.transliteration && (
            <Text style={styles.transliteration} numberOfLines={2}>
              {selectedDua.transliteration}
            </Text>
          )}
          <View style={styles.cardFooter}>
            <Text style={styles.source}>{selectedDua.source}</Text>
            <TouchableOpacity onPress={onLibraryPress} hitSlop={8}>
              <Text style={styles.changeBtn}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.emptyCard}
          onPress={onLibraryPress}
          activeOpacity={0.7}
        >
          <Text style={styles.emptyEmoji}>🤲</Text>
          <Text style={styles.emptyLabel}>Select a Dua</Text>
          <Text style={styles.emptyHint}>Tap to manage in Settings</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  activeCard: {
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
  },
  activeLabel: {
    fontSize: 10,
    color: colors.gold,
    fontFamily: fonts.uiBold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  arabicText: {
    fontSize: 16,
    color: colors.gold,
    fontFamily: fonts.arabic,
    textAlign: 'right',
    lineHeight: 22,
    marginBottom: 4,
  },
  transliteration: {
    fontSize: 9,
    color: colors.muted,
    fontFamily: fonts.ui,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: {
    fontSize: 9,
    color: colors.muted,
    fontFamily: fonts.ui,
  },
  changeBtn: {
    fontSize: 11,
    color: colors.gold,
    fontFamily: fonts.uiBold,
  },
  emptyCard: {
    backgroundColor: 'rgba(201,168,76,0.08)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(201,168,76,0.25)',
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  emptyLabel: {
    fontSize: 13,
    color: colors.white,
    fontFamily: fonts.uiBold,
  },
  emptyHint: {
    fontSize: 10,
    color: colors.muted,
    fontFamily: fonts.ui,
    marginTop: 2,
  },
});
