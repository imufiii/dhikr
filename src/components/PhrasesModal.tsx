import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { colors, fonts } from '../constants/theme';
import { CustomPhrase } from '../store/dhikrStore';

interface Props {
  visible: boolean;
  customPhrases: CustomPhrase[];
  onAdd: (phrase: CustomPhrase) => void;
  onDelete: (index: number) => void;
  onClose: () => void;
}

export default function PhrasesModal({ visible, customPhrases, onAdd, onDelete, onClose }: Props) {
  const [ar, setAr] = useState('');
  const [ro, setRo] = useState('');
  const [en, setEn] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    const trimmed = ar.trim();
    if (!trimmed) return;
    onAdd({ ar: trimmed, ro: ro.trim(), en: en.trim() });
    setAr('');
    setRo('');
    setEn('');
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 32}
          style={styles.sheet}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>Custom Phrases</Text>

          <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
            {customPhrases.length === 0 && (
              <Text style={styles.empty}>No custom phrases yet{'\n'}Add your first one below</Text>
            )}
            {customPhrases.length > 0 && (
              <Text style={styles.listCount}>{customPhrases.length} phrase{customPhrases.length > 1 ? 's' : ''} saved</Text>
            )}
            {customPhrases.map((p, i) => (
              <View key={i} style={styles.phraseRow}>
                <View style={styles.phraseText}>
                  <Text style={styles.arabic}>{p.ar}</Text>
                  {p.ro ? <Text style={styles.roman}>{p.ro}</Text> : null}
                </View>
                <TouchableOpacity onPress={() => onDelete(i)} style={styles.deleteBtn} hitSlop={12}>
                  <Text style={styles.deleteIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.form}>
            <TextInput
              style={styles.arabicInput}
              placeholder="اكتب الذكر بالعربية"
              placeholderTextColor={colors.muted}
              value={ar}
              onChangeText={setAr}
              textAlign="right"
              writingDirection="rtl"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Transliteration (optional)"
              placeholderTextColor={colors.muted}
              value={ro}
              onChangeText={setRo}
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Meaning in English (optional)"
              placeholderTextColor={colors.muted}
              value={en}
              onChangeText={setEn}
            />
            <TouchableOpacity
              style={[styles.addBtn, !ar.trim() && styles.addBtnDisabled, justAdded && styles.addBtnSuccess]}
              onPress={handleAdd}
              activeOpacity={0.7}
            >
              <Text style={styles.addBtnText}>{justAdded ? '✓ Added!' : 'Add Phrase'}</Text>
            </TouchableOpacity>
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
    backgroundColor: '#162032',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
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
    marginBottom: 20,
  },
  title: {
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
    fontFamily: fonts.ui,
  },
  list: {
    maxHeight: 180,
    marginBottom: 16,
  },
  empty: {
    color: colors.muted,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 16,
    fontFamily: fonts.ui,
  },
  listCount: {
    color: colors.gold,
    fontSize: 11,
    textAlign: 'center',
    paddingVertical: 8,
    fontFamily: fonts.ui,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  phraseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted2,
  },
  phraseText: {
    flex: 1,
  },
  arabic: {
    fontSize: 18,
    color: colors.gold,
    fontFamily: fonts.arabic,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  roman: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
    fontFamily: fonts.ui,
  },
  deleteBtn: {
    marginLeft: 12,
    padding: 4,
  },
  deleteIcon: {
    fontSize: 13,
    color: colors.muted,
  },
  form: {
    gap: 10,
  },
  arabicInput: {
    backgroundColor: colors.muted2,
    borderWidth: 1,
    borderColor: colors.goldDim,
    color: colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 20,
    fontFamily: fonts.arabic,
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
  },
  addBtn: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
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
