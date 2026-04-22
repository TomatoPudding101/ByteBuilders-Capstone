import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const COLORS = ['#f0a0c0', '#a0c0f0', '#c0f0a0', '#f0c0a0', '#c0a0f0', '#f0f0a0'];

function Piece({ color, delay, startX }: { color: string; delay: number; startX: number }) {
  const y = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(y, { toValue: 80, duration: 1200, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ]),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX,
        top: 0,
        transform: [{ translateY: y }, { rotate: spin }],
        opacity,
        width: 8,
        height: 8,
        backgroundColor: color,
        borderRadius: 2,
      }}
    />
  );
}

type Props = { points: number; onDone: () => void };

export default function CelebrationBanner({ points, onDone }: Props) {
  const bannerY = useRef(new Animated.Value(-120)).current;
  const bannerOpacity = useRef(new Animated.Value(0)).current;

  const pieces = Array.from({ length: 18 }).map((_, i) => ({
    color: COLORS[i % COLORS.length],
    delay: Math.random() * 400,
    startX: Math.random() * width,
  }));

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(bannerY, { toValue: 0, useNativeDriver: true, tension: 80 }),
        Animated.timing(bannerOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.delay(2800),
      Animated.parallel([
        Animated.timing(bannerY, { toValue: -120, duration: 400, useNativeDriver: true }),
        Animated.timing(bannerOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start(onDone);
  }, []);

  return (
    <View style={styles.overlay} pointerEvents="none">
      {pieces.map((p, i) => (
        <Piece key={i} color={p.color} delay={p.delay} startX={p.startX} />
      ))}
      <Animated.View style={[styles.banner, { transform: [{ translateY: bannerY }], opacity: bannerOpacity }]}>
        <Text style={styles.star}>🌟</Text>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>+{points} Points!</Text>
          <Text style={styles.bannerMsg}>
            Here are {points} points for completing a goal! Keep up the good work to earn more!
          </Text>
        </View>
        <Text style={styles.star}>🌟</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 999,
    height: 160,
    overflow: 'hidden',
  },
  banner: {
    position: 'absolute',
    top: 56, left: 16, right: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#8b6fd4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#d4b8f8',
  },
  star: { fontSize: 24 },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 18, fontWeight: 'bold', color: '#8b6fd4' },
  bannerMsg: { fontSize: 12, color: '#888', marginTop: 2, lineHeight: 16 },
});
