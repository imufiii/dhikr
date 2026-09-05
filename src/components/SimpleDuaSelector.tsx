import React from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { colors, fonts } from '../constants/theme';
import { UserDua } from '../constants/universalDuas';

interface Props {
  duas: UserDua[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function SimpleDuaSelector({ duas, selectedId, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.duasContent}
      >
        {duas.slice(0, 5).map(dua => (
          <TouchableOpacity
            key={dua.id}
            style={[
              styles.duaButton,
              selectedId === dua.id && styles.duaButtonActive,
            ]}
            onPress={() => onSelect(dua.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.duaButtonText, selectedId === dua.id && styles.duaButtonTextActive]}
              numberOfLines={1}
            >
              {dua.title || dua.source}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 34,
    justifyContent: 'center',
  },
  scroll: {
    flexGrow: 0,
  },
  duasContent: {
    gap: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  duaButton: {
    backgroundColor: 'rgba(201,168,76,0.08)',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.15)',
  },
  duaButtonActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  duaButtonText: {
    fontSize: 10,
    color: colors.muted,
    fontFamily: fonts.ui,
    textAlign: 'center',
  },
  duaButtonTextActive: {
    color: colors.bg,
    fontFamily: fonts.uiBold,
  },
});
