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
  onLibraryPress: () => void;
}

export default function SimpleDuaSelector({ duas, selectedId, onSelect, onLibraryPress }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.manageBtn}
        onPress={onLibraryPress}
        activeOpacity={0.7}
      >
        <Text style={styles.manageBtnText}>⚙️ Manage Duas</Text>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.duasScroll} contentContainerStyle={styles.duasContent}>
        {duas.map(dua => (
          <TouchableOpacity
            key={dua.id}
            style={[
              styles.duaButton,
              selectedId === dua.id && styles.duaButtonActive,
            ]}
            onPress={() => onSelect(dua.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.duaButtonText, selectedId === dua.id && styles.duaButtonTextActive]} numberOfLines={2}>
              {dua.source}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  manageBtn: {
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
    alignItems: 'center',
  },
  manageBtnText: {
    fontSize: 11,
    color: colors.gold,
    fontFamily: fonts.uiBold,
  },
  duasScroll: {
    maxHeight: 40,
  },
  duasContent: {
    gap: 6,
    paddingHorizontal: 0,
  },
  duaButton: {
    backgroundColor: 'rgba(201,168,76,0.08)',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.15)',
    marginRight: 6,
    minWidth: 50,
  },
  duaButtonActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  duaButtonText: {
    fontSize: 9,
    color: colors.muted,
    fontFamily: fonts.ui,
    textAlign: 'center',
  },
  duaButtonTextActive: {
    color: colors.bg,
    fontFamily: fonts.uiBold,
  },
});
