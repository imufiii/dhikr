import React from 'react';
import {
  Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { colors, fonts } from '../constants/theme';
import { SITUATIONS } from '../constants/duas';

interface Props {
  visible: boolean;
  onSelect: (situation: string) => void;
  onClose: () => void;
}

export default function SituationSelector({ visible, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>What's on Your Mind?</Text>
          <Text style={styles.subtitle}>Choose a situation to see relevant duas</Text>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false} bounces={false}>
            {SITUATIONS.map(situation => (
              <TouchableOpacity
                key={situation.id}
                style={styles.option}
                onPress={() => {
                  onSelect(situation.id);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.emoji}>{situation.emoji}</Text>
                <View style={styles.optionText}>
                  <Text style={styles.optionLabel}>{situation.label}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
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
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    color: colors.white,
    fontFamily: fonts.uiBold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: fonts.ui,
    marginBottom: 16,
  },
  list: {
    maxHeight: 400,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(201,168,76,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.1)',
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    color: colors.white,
    fontFamily: fonts.uiBold,
  },
  chevron: {
    fontSize: 20,
    color: colors.gold,
  },
});
