import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
 
const stats = [
  { label: "Today's Progress", value: '0%',  color: '#8b6fd4' },
  { label: 'Completed Today',  value: '0',   color: '#4db89a' },
  { label: 'Tasks Left',       value: '0',   color: '#5588e0' },
  { label: 'Total Points',     value: '0',   color: '#d4a020' },
];
 
const STREAK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
 
export default function KidsProgress() {
  const router = useRouter();
  const [streak] = useState(0);
  const [progress] = useState(0);
  const [totalPoints] = useState(0);
  const [goalsCompleted] = useState(0);
 
  return (
    <LinearGradient
      colors={['#fde8d0', '#f8c8d4', '#d4c8f0', '#c8e0f0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>My Progress</Text>
          <Text style={styles.headerSub}>Keep up the Good Work!</Text>
        </View>
      </View>
 
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
 
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#e8d5f8' }]}>
            <Text style={[styles.summaryValue, { color: '#7040b0' }]}>{totalPoints}</Text>
            <Text style={[styles.summaryLabel, { color: '#9060c0' }]}>Total Points</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#d5f0e8' }]}>
            <Text style={[styles.summaryValue, { color: '#208060' }]}>{streak}</Text>
            <Text style={[styles.summaryLabel, { color: '#308070' }]}>Day Streak</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#d5e8f8' }]}>
            <Text style={[styles.summaryValue, { color: '#205090' }]}>{goalsCompleted}</Text>
            <Text style={[styles.summaryLabel, { color: '#306080' }]}>Goals Done</Text>
          </View>
        </View>
 
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Progress</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: progress > 0 ? `${progress}%` : 8 }]} />
          </View>
          <Text style={styles.progressLabel}>{progress}% Complete</Text>
        </View>
 
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Day Streak</Text>
          <View style={styles.streakRow}>
            {STREAK_DAYS.map((d, i) => (
              <View key={i} style={[styles.streakDay, i < streak && styles.streakDayActive]}>
                <Text style={[styles.streakDayText, i < streak && styles.streakDayTextActive]}>{d}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.streakMsg}>
            {streak === 0 ? 'Start your streak today!' : `Amazing! ${streak} day streak!`}
          </Text>
        </View>
 
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Stats</Text>
          <View style={styles.statsGrid}>
            {stats.map((s, i) => (
              <View key={i} style={[styles.statCard, { borderTopColor: s.color, borderTopWidth: 3 }]}>
                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>
 
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Reminder</Text>
        </TouchableOpacity>
 
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No reminders yet</Text>
          <TouchableOpacity style={styles.addFirstButton}>
            <Text style={styles.addButtonText}>+ Add Your First Reminder</Text>
          </TouchableOpacity>
        </View>
 
        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12, gap: 12,
  },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 20,
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
  },
  backText: { fontSize: 20, color: '#555' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  headerSub: { fontSize: 13, fontWeight: '600', color: '#e06080' },
  scroll: { paddingHorizontal: 16 },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  summaryCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center' },
  summaryValue: { fontSize: 28, fontWeight: 'bold' },
  summaryLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center', marginTop: 2 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 18,
    padding: 16, marginBottom: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 12 },
  progressBarBg: {
    height: 20, backgroundColor: 'rgba(180,180,220,0.3)',
    borderRadius: 10, overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: '#8b6fd4', borderRadius: 10 },
  progressLabel: { fontSize: 13, color: '#888', textAlign: 'right', marginTop: 6 },
  streakRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  streakDay: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(180,180,220,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  streakDayActive: { backgroundColor: '#f0a030' },
  streakDayText: { fontSize: 13, fontWeight: '700', color: '#aaa' },
  streakDayTextActive: { color: '#fff' },
  streakMsg: { fontSize: 13, color: '#888', textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  statCard: {
    width: '47%', backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12, padding: 14, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  statValue: { fontSize: 28, fontWeight: 'bold' },
  statLabel: { fontSize: 11, color: '#888', textAlign: 'center', marginTop: 4 },
  addButton: {
    backgroundColor: '#8b6fd4', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 14,
  },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 18,
    padding: 24, alignItems: 'center', gap: 16,
  },
  emptyText: { fontSize: 15, color: '#aaa' },
  addFirstButton: {
    backgroundColor: '#8b6fd4', borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 20,
  },
});
 