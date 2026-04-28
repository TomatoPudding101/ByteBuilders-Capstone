import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, TextInput, Pressable
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppState } from '../context/AppContext';
import { useTheme } from './ThemeContext';
import CelebrationBanner from '../components/CelebrationBanner';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function GoalsTrackerScreen() {
  const router = useRouter();
  const { goals, checked, toggleCheck, pendingPoints, clearPendingPoints } = useAppState();
  const { isDarkMode, theme } = useTheme();
  const [notes, setNotes] = useState('• ');

  const chores = goals.filter(g => g.type === 'chore');
  const weeklyGoals = goals.filter(g => g.type === 'goal');

  const handleNotesChange = (text: string) => {
    const lines = text.split('\n');
    const formatted = lines.map((line, i) => {
      if (i === 0) return line;
      if (!line.startsWith('• ')) return '• ' + line;
      return line;
    });
    setNotes(formatted.join('\n'));
  };

  const handleNotesKeyPress = ({ nativeEvent }: any) => {
    if (nativeEvent.key === 'Enter') {
      setNotes(prev => prev + '\n• ');
    }
  };

  const gradientColors: [string, string, string, string] = isDarkMode
    ? ['#0f0f1a', '#1a1035', '#150d2e', '#0f0f1a']
    : ['#fde8d0', '#f8c8d4', '#d4c8f0', '#c8e0f0'];

  const cardBg = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.75)';
  const backBtnBg = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)';

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: backBtnBg }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backText, { color: theme.text }]}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTextArea}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Goals / Chores</Text>
            <Text style={styles.headerSub}>One Step at a Time!</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Daily Chores</Text>
              <View style={styles.dayRow}>
                {DAYS.map((d, i) => (
                  <Text key={i} style={styles.dayLabel}>{d}</Text>
                ))}
              </View>
            </View>
            {chores.length === 0 && (
              <Text style={[styles.emptyMsg, { color: isDarkMode ? '#b0a8d0' : '#bbb' }]}>
                No chores yet! Ask a parent to add some.
              </Text>
            )}
            {chores.map((chore, ri) => (
              <View key={chore.id} style={styles.choreRow}>
                <Text style={[styles.choreNum, { color: isDarkMode ? '#b0a8d0' : '#666' }]}>{ri + 1}.</Text>
                <Text style={[styles.choreText, { color: theme.text }]}>{chore.text}</Text>
                <View style={styles.checkRow}>
                  {DAYS.map((_, ci) => {
                    const isChecked = checked[chore.id]?.[ci] ?? false;
                    return (
                      <Pressable
                        key={ci}
                        style={[
                          styles.checkbox,
                          { borderColor: isDarkMode ? '#6060a0' : '#aaa' },
                          isChecked && styles.checkboxChecked,
                        ]}
                        onPress={() => toggleCheck(chore.id, ci)}
                      >
                        {isChecked && <Text style={styles.checkmark}>✓</Text>}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <View style={styles.weeklyHeader}>
              <Text style={styles.sectionTitle}>Weekly Goals</Text>
            </View>
            {weeklyGoals.length === 0 && (
              <Text style={[styles.emptyMsg, { color: isDarkMode ? '#b0a8d0' : '#bbb' }]}>
                No goals yet! Ask a parent to add some.
              </Text>
            )}
            {weeklyGoals.map((goal, i) => {
              const isChecked = checked[goal.id]?.[0] ?? false;
              return (
                <View key={goal.id} style={styles.goalRow}>
                  <View style={[styles.dayBadge, { backgroundColor: isChecked ? '#c0a8e8' : '#f0d0e8' }]}>
                    <Text style={styles.dayBadgeText}>{DAYS[i % 7]}</Text>
                  </View>
                  <Text style={[styles.goalText, { color: theme.text }]}>{goal.text}</Text>
                  <Pressable
                    style={[
                      styles.goalCheck,
                      { borderColor: isDarkMode ? '#6060a0' : '#aaa' },
                      isChecked && styles.goalCheckDone,
                    ]}
                    onPress={() => toggleCheck(goal.id, 0)}
                  >
                    {isChecked && <Text style={styles.checkmark}>✓</Text>}
                  </Pressable>
                </View>
              );
            })}
          </View>

          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <View style={styles.notesHeader}>
              <Text style={styles.sectionTitle}>NOTES</Text>
            </View>
            <TextInput
              style={[styles.notesInput, {
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : '#fff',
                color: theme.text,
              }]}
              multiline
              value={notes}
              onChangeText={handleNotesChange}
              onKeyPress={handleNotesKeyPress}
              placeholderTextColor={isDarkMode ? '#b0a8d0' : '#bbb'}
              textAlignVertical="top"
            />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>

      {pendingPoints !== null && (
        <CelebrationBanner points={pendingPoints} onDone={clearPendingPoints} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingBottom: 20 },
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
  headerTextArea: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerSub: { fontSize: 13, fontWeight: '600', color: '#e06080' },
  card: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    backgroundColor: 'rgba(180,230,200,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  dayRow: { flexDirection: 'row', gap: 4, marginLeft: 'auto' },
  dayLabel: {
    width: 24,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#9b6fd4',
  },
  choreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  choreNum: { fontSize: 12, width: 18 },
  choreText: { flex: 1, fontSize: 13, fontWeight: '500' },
  checkRow: { flexDirection: 'row', gap: 3 },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#80d4a0', borderColor: '#50b870' },
  checkmark: { fontSize: 13, color: '#fff', fontWeight: 'bold' },
  weeklyHeader: { alignItems: 'center', marginBottom: 12 },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  dayBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBadgeText: { fontSize: 12, fontWeight: '700', color: '#9b6fd4' },
  goalText: { flex: 1, fontSize: 13, fontWeight: '500' },
  goalCheck: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCheckDone: { backgroundColor: '#9b6fd4', borderColor: '#7a50b0' },
  notesHeader: {
    backgroundColor: 'rgba(220,190,150,0.4)',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 10,
  },
  notesInput: {
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  emptyMsg: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 12,
    fontStyle: 'italic',
  },
});