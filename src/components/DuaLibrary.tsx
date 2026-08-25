import React, { useState, useMemo } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { colors, fonts } from '../constants/theme';
import { UserDua } from '../constants/universalDuas';

interface Props {
  visible: boolean;
  duas: UserDua[];
  onEdit: (dua: UserDua) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function DuaLibrary({ visible, duas, onEdit, onDelete, onClose }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDuas = useMemo(() => {
    if (!searchQuery.trim()) return duas;
    const query = searchQuery.toLowerCase();
    return duas.filter(d => {
      const arabicMatch = d.arabicText.includes(searchQuery);
      const translitMatch = d.transliteration.toLowerCase().includes(query);
      const meaningMatch = d.englishMeaning.toLowerCase().includes(query);
      const sourceMatch = d.source.toLowerCase().includes(query);
      return arabicMatch || translitMatch || meaningMatch || sourceMatch;
    });
  }, [duas, searchQuery]);

  const builtInDuas = filteredDuas.filter(d => d.isBuiltIn);
  const customDuas = filteredDuas.filter(d => !d.isBuiltIn);

  const DuaItem = ({ dua, isCustom }: { dua: UserDua; isCustom: boolean }) => {
    const isExpanded = expandedId === dua.id;

    return (
      <View key={dua.id}>
        <TouchableOpacity
          style={styles.duaItem}
          onPress={() => setExpandedId(isExpanded ? null : dua.id)}
          activeOpacity={0.7}
        >
          <View style={styles.duaItemHeader}>
            <View style={styles.duaItemText}>
              <Text style={styles.arabicPreview} numberOfLines={1}>
                {dua.arabicText}
              </Text>
              <Text style={styles.sourceLabel}>{dua.source}</Text>
            </View>
            <Text style={styles.expandIcon}>{isExpanded ? '▼' : '›'}</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.duaExpanded}>
            <Text style={styles.arabicFull}>{dua.arabicText}</Text>
            {dua.transliteration && (
              <Text style={styles.transliteration}>{dua.transliteration}</Text>
            )}
            {dua.englishMeaning && (
              <Text style={styles.meaning}>{dua.englishMeaning}</Text>
            )}

            {isCustom && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.editBtn]}
                  onPress={() => onEdit(dua)}
                >
                  <Text style={styles.actionBtnText}>✎ Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => onDelete(dua.id)}
                >
                  <Text style={styles.actionBtnText}>✕ Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 32}
          style={styles.sheet}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>My Dua Library</Text>
          <Text style={styles.subtitle}>{duas.length} duas total</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search duas..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <ScrollView style={styles.list} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>
            {builtInDuas.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>Built-in Duas</Text>
                <View style={styles.section}>
                  {builtInDuas.map(dua => (
                    <DuaItem key={dua.id} dua={dua} isCustom={false} />
                  ))}
                </View>
              </>
            )}

            {customDuas.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>My Custom Duas</Text>
                <View style={styles.section}>
                  {customDuas.map(dua => (
                    <DuaItem key={dua.id} dua={dua} isCustom={true} />
                  ))}
                </View>
              </>
            )}

            {duas.length === 0 && (
              <Text style={styles.empty}>No duas yet. Add your first one!</Text>
            )}
          </ScrollView>
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
    backgroundColor: '#162032',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.goldDim,
    maxHeight: '88%',
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
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: colors.muted2,
    borderWidth: 1,
    borderColor: colors.goldDim,
    color: colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: fonts.ui,
    marginBottom: 12,
  },
  list: {
    maxHeight: 480,
  },
  sectionLabel: {
    fontSize: 11,
    color: colors.gold,
    fontFamily: fonts.uiBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 8,
  },
  section: {
    gap: 8,
    marginBottom: 16,
  },
  duaItem: {
    backgroundColor: 'rgba(201,168,76,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.15)',
    overflow: 'hidden',
  },
  duaItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  duaItemText: {
    flex: 1,
  },
  arabicPreview: {
    fontSize: 14,
    color: colors.gold,
    fontFamily: fonts.arabic,
    textAlign: 'right',
    marginBottom: 4,
  },
  sourceLabel: {
    fontSize: 10,
    color: colors.muted,
    fontFamily: fonts.ui,
  },
  expandIcon: {
    fontSize: 14,
    color: colors.gold,
    marginLeft: 8,
  },
  duaExpanded: {
    backgroundColor: 'rgba(201,168,76,0.04)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(201,168,76,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  arabicFull: {
    fontSize: 16,
    color: colors.gold,
    fontFamily: fonts.arabic,
    textAlign: 'right',
    lineHeight: 26,
  },
  transliteration: {
    fontSize: 10,
    color: colors.muted,
    fontFamily: fonts.ui,
    fontStyle: 'italic',
  },
  meaning: {
    fontSize: 12,
    color: 'rgba(245,240,232,0.7)',
    fontFamily: fonts.ui,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: 'rgba(201,168,76,0.3)',
  },
  deleteBtn: {
    backgroundColor: 'rgba(239,68,68,0.2)',
  },
  actionBtnText: {
    fontSize: 11,
    color: colors.white,
    fontFamily: fonts.uiBold,
  },
  empty: {
    color: colors.muted,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 32,
    fontFamily: fonts.ui,
  },
});
