import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { colors, fonts } from '../constants/theme';
import { UserDua } from '../constants/universalDuas';

interface Props {
  visible: boolean;
  onAdd: (dua: UserDua) => void;
  onClose: () => void;
}

export default function ImportDuaModal({ visible, onAdd, onClose }: Props) {
  const [arabicText, setArabicText] = useState('');
  const [transliteration, setTransliteration] = useState('');
  const [englishMeaning, setEnglishMeaning] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('Custom');
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    const trimmed = arabicText.trim();
    if (!trimmed) return;

    const newDua: UserDua = {
      id: `custom_${Date.now()}`,
      arabicText: trimmed,
      transliteration: transliteration.trim(),
      englishMeaning: englishMeaning.trim(),
      source: source.trim() || 'Custom',
      category: category.trim() || 'Custom',
      isBuiltIn: false,
    };

    onAdd(newDua);
    setArabicText('');
    setTransliteration('');
    setEnglishMeaning('');
    setSource('');
    setCategory('Custom');
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 32}
          style={styles.sheet}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>Add Dua</Text>
          <Text style={styles.subtitle}>Search online, then paste here</Text>

          <ScrollView style={styles.form} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Arabic Text *</Text>
            <TextInput
              style={styles.arabicInput}
              placeholder="اكتب الدعاء بالعربية"
              placeholderTextColor={colors.muted}
              value={arabicText}
              onChangeText={setArabicText}
              textAlign="right"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Transliteration (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Transliteration in English letters"
              placeholderTextColor={colors.muted}
              value={transliteration}
              onChangeText={setTransliteration}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>English Meaning (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="What does this dua mean?"
              placeholderTextColor={colors.muted}
              value={englishMeaning}
              onChangeText={setEnglishMeaning}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Source (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Quran 2:286, Sahih Bukhari, Fortress of Muslim"
              placeholderTextColor={colors.muted}
              value={source}
              onChangeText={setSource}
            />

            <Text style={styles.label}>Category (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Health, Work, Family"
              placeholderTextColor={colors.muted}
              value={category}
              onChangeText={setCategory}
            />

            <TouchableOpacity
              style={[styles.addBtn, !arabicText.trim() && styles.addBtnDisabled, justAdded && styles.addBtnSuccess]}
              onPress={handleAdd}
              activeOpacity={0.7}
            >
              <Text style={styles.addBtnText}>{justAdded ? '✓ Added!' : 'Add to My Library'}</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.goldDim,
    maxHeight: '90%',
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
  form: {
    gap: 12,
  },
  label: {
    fontSize: 12,
    color: colors.gold,
    fontFamily: fonts.uiBold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  arabicInput: {
    backgroundColor: colors.muted2,
    borderWidth: 1,
    borderColor: colors.goldDim,
    color: colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: fonts.arabic,
    textAlignVertical: 'top',
  },
  input: {
    backgroundColor: colors.muted2,
    borderWidth: 1,
    borderColor: 'transparent',
    color: colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: fonts.ui,
    textAlignVertical: 'top',
  },
  addBtn: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  addBtnDisabled: {
    opacity: 0.35,
  },
  addBtnSuccess: {
    backgroundColor: '#22C55E',
  },
  addBtnText: {
    color: colors.bg,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontFamily: fonts.uiBold,
  },
});
