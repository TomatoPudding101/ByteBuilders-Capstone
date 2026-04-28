import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppState } from '../context/AppContext';
import { useTheme } from './ThemeContext';

const REWARDS = [
  { id: 1, label: 'Unlock 2 profile characters', points: 5,   color: '#c8a8e8', dark: '#7040b0', icon: '👤' },
  { id: 2, label: 'Choose your background',      points: 10,  color: '#a8d8c8', dark: '#208060', icon: '🖼️' },
  { id: 3, label: 'Special surprise!',           points: 25,  color: '#a8c8e8', dark: '#205090', icon: '🎁' },
  { id: 4, label: '15 min extra screen time',    points: 50,  color: '#f8d8a8', dark: '#905010', icon: '📱' },
  { id: 5, label: 'Stay up 15 min later',        points: 75,  color: '#f8c8d0', dark: '#902040', icon: '🌙' },
  { id: 6, label: 'Choose dinner tonight',       points: 100, color: '#d0e8a8', dark: '#406010', icon: '🍽️' },
  { id: 7, label: 'Small treat',                 points: 200, color: '#e8d0a8', dark: '#704010', icon: '🍬' },
  { id: 8, label: 'Small toy',                   points: 300, color: '#d8a8e8', dark: '#602080', icon: '🧸' },
];

export default function KidsRewards() {
  const router = useRouter();
  const { totalPoints } = useAppState();
  const { isDarkMode, theme } = useTheme();

  const gradientColors: [string, string, string, string] = isDarkMode
    ? ['#0f0f1a', '#1a1035', '#150d2e', '#0f0f1a']
    : ['#fde8d0', '#f8c8d4', '#d4c8f0', '#c8e0f0'];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.5)' }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backText, { color: theme.text }]}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>My Rewards</Text>
          <Text style={styles.headerSub}>Earn points, unlock rewards!</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <View style={[styles.pointsBanner, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.8)' }]}>
          <Text style={[styles.pointsLabel, { color: isDarkMode ? '#e0d8f0' : '#888' }]}>My Points</Text>
          <Text style={styles.pointsValue}>{totalPoints}</Text>
          <Text style={[styles.pointsHint, { color: isDarkMode ? '#b0a8d0' : '#aaa' }]}>Complete goals to earn more points!</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Rewards Shop</Text>
        {REWARDS.map((reward) => {
          const unlocked = totalPoints >= reward.points;
          const ptsLeft = reward.points - totalPoints;
          return (
            <View
              key={reward.id}
              style={[
                styles.rewardCard,
                { backgroundColor: isDarkMode ? reward.dark + '88' : reward.color, opacity: unlocked ? 1 : 0.85 },
              ]}
            >
              <View style={styles.rewardLeft}>
                <Text style={styles.rewardIcon}>{reward.icon}</Text>
                <View>
                  <Text style={[styles.rewardLabel, { color: '#fff' }]}>{reward.label}</Text>
                  <Text style={[styles.rewardPoints, { color: isDarkMode ? '#e0d8f0' : reward.dark }]}>
                    {reward.points} points
                  </Text>
                </View>
              </View>
              <View style={[
                styles.redeemBtn,
                { backgroundColor: unlocked ? reward.dark : 'rgba(60,60,80,0.75)' },
              ]}>
                <Text style={styles.redeemText}>
                  {unlocked ? 'Redeem' : `${ptsLeft} pts`}
                </Text>
              </View>
            </View>
          );
        })}

        <View style={[styles.parentNote, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)' }]}>
          <Text style={[styles.parentNoteText, { color: isDarkMode ? '#b0a8d0' : '#888' }]}>
            Rewards are parent-controlled. Ask a parent to help you redeem!
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerSub: { fontSize: 13, fontWeight: '600', color: '#e06080' },
  scroll: { paddingHorizontal: 16 },
  pointsBanner: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsLabel: { fontSize: 14, fontWeight: '600' },
  pointsValue: { fontSize: 56, fontWeight: 'bold', color: '#8b6fd4' },
  pointsHint: { fontSize: 12, marginTop: 4 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  rewardCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  rewardIcon: { fontSize: 28 },
  rewardLabel: { fontSize: 14, fontWeight: '700', flexWrap: 'wrap', maxWidth: 160 },
  rewardPoints: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  redeemBtn: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  redeemText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
  },
  parentNote: {
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  parentNoteText: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
});