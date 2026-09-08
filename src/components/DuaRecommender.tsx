import React from 'react';
import {
  Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { colors, fonts } from '../constants/theme';
import { DUAS, SITUATIONS, Dua } from '../constants/duas';

interface Props {
  visible: boolean;
  situation: string | null;
  onSelect: (dua: Dua) => void;
  onClose: () => void;
}

export default function DuaRecommender({ visible, situation, onSelect, onClose }: Props) {
  if (!situation || !(situation in DUAS)) {
    return null;
  }

  const duas = DUAS[situation as keyof typeof DUAS] || [];
  const situationData = SITUATIONS.find(s => s.id === situation);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.emoji}>{situationData?.emoji}</Text>
            <View style={styles.headerText}>
              <Text style={styles.title}>{situationData?.label}</Text>
              <Text style={styles.subtitle}>{duas.length} dua{duas.length !== 1 ? 's' : ''} available</Text>
            </View>
          </View>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false} bounces={false}>
            {duas.map((dua, index) => (
              <TouchableOpacity
                key={dua.id}
                style={styles.duaCard}
                onPress={() => {
                  onSelect(dua);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <View style={styles.duaNumber}>
                  <Text style={styles.duaNumberText}>{index + 1}</Text>
                </View>

                <View style={styles.duaContent}>
                  <Text style={styles.arabicText}>{dua.arabicText}</Text>
                  <Text style={styles.transliteration}>{dua.transliteration}</Text>
                  <Text style={styles.meaning}>{dua.englishMeaning}</Text>
                  <Text style={styles.source}>— {dua.source}</Text>
                </View>

                <Text style={styles.select}>›</Text>
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
    maxHeight: '85%',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.muted2,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: colors.white,
    fontFamily: fonts.uiBold,
  },
  subtitle: {
    fontSize: 11,
    color: colors.muted,
    fontFamily: fonts.ui,
    marginTop: 2,
  },
  list: {
    maxHeight: 500,
  },
  duaCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(201,168,76,0.08)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.15)',
  },
  duaNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  duaNumberText: {
    fontSize: 13,
    color: colors.bg,
    fontFamily: fonts.uiBold,
  },
  duaContent: {
    flex: 1,
  },
  arabicText: {
    fontSize: 16,
    color: colors.gold,
    fontFamily: fonts.arabic,
    textAlign: 'right',
    marginBottom: 6,
    lineHeight: 24,
  },
  transliteration: {
    fontSize: 10,
    color: colors.muted,
    fontFamily: fonts.ui,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  meaning: {
    fontSize: 12,
    color: 'rgba(245,240,232,0.7)',
    fontFamily: fonts.ui,
    lineHeight: 18,
    marginBottom: 4,
  },
  source: {
    fontSize: 10,
    color: colors.muted,
    fontFamily: fonts.ui,
  },
  select: {
    fontSize: 18,
    color: colors.gold,
    fontWeight: '600',
    marginLeft: 8,
    alignSelf: 'center',
  },
});
