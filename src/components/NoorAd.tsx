// Noor Ads — one human-vetted ad served by the Noor Ads network.
// Fetches a single ad and renders it as a native card styled to match Dhikr.
// Privacy: the ONLY thing sent to the server is the SDK key below — no user
// data, no device id, no location.
import { useEffect, useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

// The live Noor Ads ad server (Cloudflare Worker — always-on, free, global).
// Works everywhere: simulator, real phone, shipped App Store build.
const BASE_URL = 'https://noorads-adserver.mufeedmuneer9.workers.dev';

// This app's Noor Ads SDK key (identifies the app to the ad server).
const SDK_KEY = 'noor_ac3de5be74ec99b76e91dfd869be82f6c1b8';

type Ad = {
  headline: string;
  body: string;
  imageUrl: string | null;
  ctaText: string;
  impressionUrl: string;
  clickUrl: string;
};

export default function NoorAd() {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch(`${BASE_URL}/api/v1/serve?key=${encodeURIComponent(SDK_KEY)}`)
      .then(r => r.json())
      .then(d => {
        if (!mounted || !d.ad) return;
        setAd(d.ad);
        fetch(d.ad.impressionUrl).catch(() => {}); // count the view; never break the app
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  if (!ad) return null; // no fill → render nothing

  return (
    <Pressable
      style={styles.card}
      onPress={() => Linking.openURL(ad.clickUrl).catch(() => {})}
      accessibilityRole="link"
      accessibilityLabel={`Sponsored: ${ad.headline}`}
    >
      {ad.imageUrl ? <Image source={{ uri: ad.imageUrl }} style={styles.image} resizeMode="cover" /> : null}
      <View style={styles.body}>
        <Text style={styles.sponsored}>SPONSORED · NOOR ADS</Text>
        <Text style={styles.headline}>{ad.headline}</Text>
        <Text style={styles.text}>{ad.body}</Text>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>{ad.ctaText || 'Learn More'}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: { width: '100%', height: 140 },
  body: { padding: 14 },
  sponsored: { fontSize: 10, letterSpacing: 1, color: colors.muted, fontFamily: fonts.ui },
  headline: { marginTop: 6, fontSize: 15, color: colors.white, fontFamily: fonts.uiBold },
  text: { marginTop: 4, fontSize: 13, lineHeight: 19, color: 'rgba(245,240,232,0.6)', fontFamily: fonts.ui },
  cta: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.gold,
  },
  ctaText: { fontSize: 13, color: '#111827', fontFamily: fonts.uiBold },
});
