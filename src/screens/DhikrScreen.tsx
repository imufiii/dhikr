import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../constants/theme';
import { PHRASES, TARGETS } from '../constants/phrases';
import { loadState, saveState, DhikrState, SessionRecord, CustomPhrase, todayString } from '../store/dhikrStore';
import { useShakeDetector } from '../hooks/useShakeDetector';
import { usePocketMode } from '../hooks/usePocketMode';
import { useVolumeButton } from '../hooks/useVolumeButton';
import HistoryModal from '../components/HistoryModal';
import SettingsModal from '../components/SettingsModal';
import PhrasesModal from '../components/PhrasesModal';
import { usePrayerTimes } from '../hooks/usePrayerTimes';

const { width } = Dimensions.get('window');
const RING_SIZE = Math.min(width * 0.72, 340);
const STROKE_WIDTH = 3;
const RADIUS = RING_SIZE / 2 - 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const DOT_COUNT = 33;
const SWIPE_THRESHOLD = 40;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function DhikrScreen() {
  const { top: topInset } = useSafeAreaInsets();
  const [ready, setReady] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [haptic, setHaptic] = useState(true);
  const [shake, setShake] = useState(true);
  const [volumeBtn, setVolumeBtn] = useState(true);
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [dailyTotals, setDailyTotals] = useState<Record<string, number>>({});
  const [phraseTotals, setPhraseTotals] = useState<Record<string, number>>({});
  const [customPhrases, setCustomPhrases] = useState<CustomPhrase[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPhrases, setShowPhrases] = useState(false);
  const [completing, setCompleting] = useState(false);

  const sessionStart = useRef(Date.now());
  const lastDateRef = useRef('');
  const todayCountRef = useRef(todayCount);
  const countRef = useRef(count);
  const phraseIndexRef = useRef(phraseIndex);
  const targetRef = useRef(target);
  const countAnim = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const bannerAnim = useRef(new Animated.Value(-150)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { countRef.current = count; }, [count]);
  useEffect(() => { phraseIndexRef.current = phraseIndex; }, [phraseIndex]);
  useEffect(() => { targetRef.current = target; }, [target]);
  useEffect(() => { todayCountRef.current = todayCount; }, [todayCount]);

  useEffect(() => {
    loadState().then((s: DhikrState) => {
      setPhraseIndex(s.phraseIndex);
      setTarget(s.target);
      setHaptic(s.haptic);
      setShake(s.shake ?? true);
      setVolumeBtn(s.volumeBtn ?? true);
      setHistory(s.history);
      setTodayCount(s.todayCount ?? 0);
      setDailyTotals(s.dailyTotals ?? {});
      setPhraseTotals(s.phraseTotals ?? {});
      setCustomPhrases(s.customPhrases ?? []);
      lastDateRef.current = s.lastDate;
      setReady(true);
    });
    activateKeepAwakeAsync();
    return () => { deactivateKeepAwake(); };
  }, []);

  // Reset todayCount at midnight, archiving old day into dailyTotals
  useEffect(() => {
    const interval = setInterval(() => {
      const today = todayString();
      if (lastDateRef.current && lastDateRef.current !== today) {
        const oldDate = lastDateRef.current;
        const oldCount = todayCountRef.current;
        if (oldCount > 0) {
          setDailyTotals(d => ({ ...d, [oldDate]: oldCount }));
        }
        setTodayCount(0);
        lastDateRef.current = today;
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveState({ phraseIndex, target, haptic, shake, volumeBtn, history, todayCount, lastDate: lastDateRef.current, dailyTotals, phraseTotals, customPhrases });
  }, [phraseIndex, target, haptic, shake, volumeBtn, history, todayCount, dailyTotals, phraseTotals, customPhrases, ready]);

  useEffect(() => {
    const pct = target > 0 ? Math.min(count / target, 1) : 0;
    Animated.timing(progressAnim, {
      toValue: pct,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [count, target]);

  const triggerHaptic = useCallback((type: 'light' | 'complete') => {
    if (!haptic) return;
    if (type === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (type === 'complete') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [haptic]);

  const animateCount = useCallback(() => {
    countAnim.setValue(1.12);
    Animated.spring(countAnim, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start();
  }, [countAnim]);

  const showBanner = useCallback(() => {
    bannerAnim.setValue(-150);
    Animated.sequence([
      Animated.spring(bannerAnim, { toValue: 0, useNativeDriver: true, tension: 120, friction: 10 }),
      Animated.delay(2000),
      Animated.timing(bannerAnim, { toValue: -150, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [bannerAnim]);

  const flashScreen = useCallback(() => {
    flashAnim.setValue(0.5);
    Animated.timing(flashAnim, { toValue: 0, duration: 800, useNativeDriver: true }).start();
  }, [flashAnim]);

  const onComplete = useCallback(() => {
    if (completing) return;
    setCompleting(true);
    const currentCount = countRef.current;
    const currentPhrase = allPhrasesRef.current[phraseIndexRef.current] ?? PHRASES[phraseIndexRef.current];
    const duration = Math.round((Date.now() - sessionStart.current) / 1000);
    const record: SessionRecord = {
      phraseRo: currentPhrase.ro,
      phraseAr: currentPhrase.ar,
      count: currentCount,
      target: targetRef.current,
      duration,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    };
    setHistory(h => [record, ...h].slice(0, 30));
    setTodayCount(t => t + currentCount);
    setPhraseTotals(pt => ({ ...pt, [currentPhrase.ro]: (pt[currentPhrase.ro] ?? 0) + currentCount }));
    triggerHaptic('complete');
    flashScreen();
    showBanner();
    setTimeout(() => {
      setCount(0);
      sessionStart.current = Date.now();
      progressAnim.setValue(0);
      setCompleting(false);
    }, 900);
  }, [completing, triggerHaptic, flashScreen, showBanner]);

  const increment = useCallback(() => {
    if (completing) return;
    const next = count + 1;
    setCount(next);
    animateCount();
    triggerHaptic('light');
    if (target > 0 && next >= target) {
      setTimeout(onComplete, 80);
    }
  }, [count, target, completing, animateCount, triggerHaptic, onComplete]);

  const decrement = useCallback(() => {
    if (completing) return;
    setCount(c => Math.max(0, c - 1));
    triggerHaptic('light');
  }, [completing, triggerHaptic]);

  const reset = useCallback(() => {
    if (countRef.current > 0) {
      const duration = Math.round((Date.now() - sessionStart.current) / 1000);
      const ro = allPhrases[phraseIndexRef.current]?.ro ?? PHRASES[phraseIndexRef.current].ro;
      const ar = allPhrases[phraseIndexRef.current]?.ar ?? PHRASES[phraseIndexRef.current].ar;
      const record: SessionRecord = {
        phraseRo: ro, phraseAr: ar,
        count: countRef.current, target: targetRef.current, duration,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      };
      setHistory(h => [record, ...h].slice(0, 30));
      setPhraseTotals(pt => ({ ...pt, [ro]: (pt[ro] ?? 0) + countRef.current }));
    }
    setCount(0);
    sessionStart.current = Date.now();
    progressAnim.setValue(0);
    triggerHaptic('light');
  }, [triggerHaptic]);

  const switchPhrase = useCallback((delta: number) => {
    if (countRef.current > 0) {
      const duration = Math.round((Date.now() - sessionStart.current) / 1000);
      const ro = allPhrases[phraseIndexRef.current]?.ro ?? PHRASES[phraseIndexRef.current].ro;
      const ar = allPhrases[phraseIndexRef.current]?.ar ?? PHRASES[phraseIndexRef.current].ar;
      const record: SessionRecord = {
        phraseRo: ro, phraseAr: ar,
        count: countRef.current, target: targetRef.current, duration,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      };
      setHistory(h => [record, ...h].slice(0, 30));
      setPhraseTotals(pt => ({ ...pt, [ro]: (pt[ro] ?? 0) + countRef.current }));
    }
    setCount(0);
    sessionStart.current = Date.now();
    progressAnim.setValue(0);
    setPhraseIndex(i => (i + delta + allPhrases.length) % allPhrases.length);
    triggerHaptic('light');
  }, [triggerHaptic]);

  const switchPhraseRef = useRef(switchPhrase);
  useEffect(() => { switchPhraseRef.current = switchPhrase; }, [switchPhrase]);

  const swipeResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, gs) =>
        Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5 && Math.abs(gs.dx) > 8,
      onPanResponderRelease: (_e, gs) => {
        if (gs.dx < -SWIPE_THRESHOLD) switchPhraseRef.current(+1);
        else if (gs.dx > SWIPE_THRESHOLD) switchPhraseRef.current(-1);
      },
    })
  ).current;

  const selectTarget = useCallback((t: number) => {
    setTarget(t);
    setCount(0);
    sessionStart.current = Date.now();
    progressAnim.setValue(0);
    triggerHaptic('light');
  }, [triggerHaptic]);

  const allPhrases = useMemo(() => [...PHRASES, ...customPhrases], [customPhrases]);
  const allPhrasesRef = useRef(allPhrases);
  useEffect(() => { allPhrasesRef.current = allPhrases; }, [allPhrases]);

  const { pocketMode, enterPocketMode, exitPocketMode } = usePocketMode();
  const { nextPrayer } = usePrayerTimes();
  useShakeDetector({ enabled: shake, onShake: increment });
  useVolumeButton({ enabled: volumeBtn, onPress: increment });

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const phrase = allPhrases[phraseIndex] ?? PHRASES[0];

  const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
    const angle = (i / DOT_COUNT) * 2 * Math.PI - Math.PI / 2;
    const r = RING_SIZE / 2 - 12;
    const x = RING_SIZE / 2 + r * Math.cos(angle);
    const y = RING_SIZE / 2 + r * Math.sin(angle);
    return { x, y, filled: target === 33 && i < count };
  });

  if (!ready) return <SafeAreaView style={styles.container} />;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View pointerEvents="none" style={[styles.flash, { opacity: flashAnim }]} />

      {pocketMode && (
        <Pressable
          style={styles.pocketOverlay}
          onPress={increment}
          onLongPress={exitPocketMode}
          delayLongPress={600}
        >
          <View style={styles.pocketDot} />
        </Pressable>
      )}

      <Animated.View style={[styles.banner, { top: topInset + 8, transform: [{ translateY: bannerAnim }] }]}>
        <Text style={styles.bannerText}>مبروك ✦ Alhamdulillah</Text>
      </Animated.View>

      <TouchableOpacity
        style={styles.phraseArea}
        onPress={() => switchPhrase(+1)}
        activeOpacity={0.7}
        {...swipeResponder.panHandlers}
      >
        <Text style={styles.arabicText}>{phrase.ar}</Text>
        <Text style={styles.romanText}>{phrase.ro}</Text>
        <Text style={styles.englishText}>{phrase.en}</Text>
        <Text style={styles.swipeHint}>tap or swipe to change · resets count</Text>
      </TouchableOpacity>

      {nextPrayer && (
        <Text style={styles.nextPrayer}>{nextPrayer.name} · {nextPrayer.timeString}</Text>
      )}

      <Pressable
        style={[styles.ring, { width: RING_SIZE, height: RING_SIZE }]}
        onPress={increment}
        onLongPress={decrement}
        delayLongPress={400}
      >
        {target === 33 && (
          <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
            {dots.map((d, i) => (
              <Circle key={i} cx={d.x} cy={d.y} r={4}
                fill={d.filled ? colors.gold : colors.muted2} />
            ))}
          </Svg>
        )}

        {target !== 33 && (
          <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
            <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS}
              fill="none" stroke={colors.muted2} strokeWidth={STROKE_WIDTH} />
            <AnimatedCircle
              cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS}
              fill="none" stroke={colors.gold} strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={strokeDashoffset}
              rotation="-90"
              origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
            />
          </Svg>
        )}

        <View style={styles.innerCircle}>
          <Animated.Text style={[styles.countNumber, { transform: [{ scale: countAnim }] }]}>
            {count}
          </Animated.Text>
          <Text style={styles.countMeta}>
            {target === 0 ? 'free' : `of ${target >= 1000 ? '1,000' : target}`}
          </Text>
        </View>
      </Pressable>

      <View style={styles.bottom}>
        {todayCount > 0 && (
          <Text style={styles.todayText}>today · {todayCount.toLocaleString()}</Text>
        )}

        <View style={styles.targetRow}>
          {TARGETS.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.pill, target === t && styles.pillActive]}
              onPress={() => selectTarget(t)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, target === t && styles.pillTextActive]}>
                {t === 0 ? '∞' : t >= 1000 ? '1K' : t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowHistory(true)}>
            <Text style={styles.actionIcon}>⏱</Text>
            <Text style={styles.actionLabel}>History</Text>
          </TouchableOpacity>

          <View style={styles.centerBtns}>
            <TouchableOpacity style={styles.resetBtn} onPress={reset}>
              <Text style={styles.resetIcon}>↺</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pocketBtn} onPress={enterPocketMode}>
              <Text style={styles.pocketLabel}>Pocket</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowSettings(true)}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionLabel}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <HistoryModal
        visible={showHistory}
        dailyTotals={dailyTotals}
        phraseTotals={phraseTotals}
        todayCount={todayCount}
        todayDate={lastDateRef.current}
        customPhrases={customPhrases}
        onClose={() => setShowHistory(false)}
      />
      <SettingsModal
        visible={showSettings}
        haptic={haptic}
        setHaptic={setHaptic}
        shake={shake}
        setShake={setShake}
        volumeBtn={volumeBtn}
        setVolumeBtn={setVolumeBtn}
        target={target}
        selectTarget={selectTarget}
        onManagePhrases={() => { setShowSettings(false); setShowPhrases(true); }}
        onClose={() => setShowSettings(false)}
      />
      <PhrasesModal
        visible={showPhrases}
        customPhrases={customPhrases}
        onAdd={phrase => setCustomPhrases(p => [...p, phrase])}
        onDelete={i => {
          const globalIndex = PHRASES.length + i;
          setCustomPhrases(p => p.filter((_, idx) => idx !== i));
          if (phraseIndex === globalIndex || phraseIndex >= PHRASES.length + customPhrases.length - 1) {
            setPhraseIndex(0);
          }
        }}
        onClose={() => setShowPhrases(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.gold,
    zIndex: 100,
    pointerEvents: 'none',
  },
  banner: {
    position: 'absolute',
    top: 8,
    zIndex: 200,
    backgroundColor: colors.gold,
    borderRadius: 40,
    paddingHorizontal: 24,
    paddingVertical: 10,
    shadowColor: colors.gold,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  bannerText: {
    color: colors.bg,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontFamily: fonts.uiBold,
  },
  phraseArea: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 8,
    gap: 4,
  },
  arabicText: {
    fontSize: 28,
    color: colors.gold,
    textAlign: 'center',
    writingDirection: 'rtl',
    fontFamily: fonts.arabic,
  },
  romanText: {
    fontSize: 12,
    color: colors.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: fonts.ui,
  },
  englishText: {
    fontSize: 11,
    color: colors.muted,
    opacity: 0.6,
    fontFamily: fonts.ui,
  },
  swipeHint: {
    fontSize: 9,
    color: colors.muted,
    opacity: 0.35,
    letterSpacing: 0.8,
    marginTop: 2,
    fontFamily: fonts.ui,
  },
  nextPrayer: {
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 1.2,
    opacity: 0.7,
    fontFamily: fonts.ui,
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: '82%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  countNumber: {
    fontSize: Math.min(width * 0.22, 110),
    fontWeight: '300',
    color: colors.white,
    lineHeight: Math.min(width * 0.22, 110) * 1.1,
  },
  countMeta: {
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: fonts.ui,
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  todayText: {
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    opacity: 0.7,
    fontFamily: fonts.ui,
  },
  targetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pillActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldDim,
  },
  pillText: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: fonts.ui,
  },
  pillTextActive: {
    color: colors.gold,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
    minHeight: 48,
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 22,
  },
  actionLabel: {
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: fonts.ui,
  },
  centerBtns: {
    alignItems: 'center',
    gap: 6,
  },
  resetBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.muted2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetIcon: {
    fontSize: 24,
    color: colors.muted,
  },
  pocketBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.muted2,
  },
  pocketLabel: {
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  pocketOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
    zIndex: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pocketDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gold,
    opacity: 0.3,
  },
});
