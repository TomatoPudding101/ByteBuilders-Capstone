import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, TextInput, Switch, Pressable
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppState } from '../context/AppContext';

type Tab = 'goals' | 'preferences' | 'accessibility';

export default function ParentSettings() {
  const router = useRouter();
  const { goals, addGoal, removeGoal } = useAppState();
  const [activeTab, setActiveTab] = useState<Tab>('goals');
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalType, setNewGoalType] = useState<'chore' | 'goal'>('chore');
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [timerReminders, setTimerReminders] = useState(true);
  const [goalReminders, setGoalReminders] = useState(true);
  const [saveConfirm, setSaveConfirm] = useState(false);

  const handleAddGoal = () => {
    if (!newGoalText.trim()) return;
    addGoal({ text: newGoalText.trim(), type: newGoalType, points: 5 });
    setNewGoalText('');
  };

  const handleRemove = (id: string) => {
    removeGoal(id);
  };

  const handleSignOut = () => {
    router.replace('/kidshome');
  };

  const handleSave = () => {
    setSaveConfirm(true);
    setTimeout(() => setSaveConfirm(false), 2000);
  };

  const notificationSettings = [
    { label: 'Push Notifications', desc: 'Get reminded about tasks', value: pushNotifications, set: setPushNotifications, color: '#5588e0' },
    { label: 'Sound Effects', desc: 'Play sounds for actions', value: soundEffects, set: setSoundEffects, color: '#3cc470' },
    { label: 'Timer Reminders', desc: 'Notify when timer ends', value: timerReminders, set: setTimerReminders, color: '#e040a0' },
    { label: 'Goal Reminders', desc: 'Daily goal check-ins', value: goalReminders, set: setGoalReminders, color: '#9b6fd4' },
  ];

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
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {(['goals', 'preferences', 'accessibility'] as Tab[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'goals' ? 'Goals' : tab === 'preferences' ? 'Preferences' : 'Accessibility'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {activeTab === 'goals' && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Add Goal / Chore</Text>
              <Text style={styles.cardSub}>Children will see these in their Goals page</Text>

              <View style={styles.typeRow}>
                <TouchableOpacity
                  style={[styles.typeBtn, newGoalType === 'chore' && styles.typeBtnActive]}
                  onPress={() => setNewGoalType('chore')}
                >
                  <Text style={[styles.typeBtnText, newGoalType === 'chore' && styles.typeBtnTextActive]}>
                    Chore
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeBtn, newGoalType === 'goal' && styles.typeBtnActive]}
                  onPress={() => setNewGoalType('goal')}
                >
                  <Text style={[styles.typeBtnText, newGoalType === 'goal' && styles.typeBtnTextActive]}>
                    Weekly Goal
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="e.g. Make your bed, Read for 20 min..."
                placeholderTextColor="#bbb"
                value={newGoalText}
                onChangeText={setNewGoalText}
              />

              <TouchableOpacity style={styles.addBtn} onPress={handleAddGoal}>
                <Text style={styles.addBtnText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Current Chores</Text>
              {goals.filter(g => g.type === 'chore').length === 0 && (
                <Text style={styles.emptyMsg}>No chores added yet.</Text>
              )}
              {goals.filter(g => g.type === 'chore').map(g => (
                <View key={g.id} style={styles.goalItem}>
                  <Text style={styles.goalItemText}>{g.text}</Text>
                  <Pressable style={styles.removeBtn} onPress={() => handleRemove(g.id)}>
                    <Text style={styles.removeBtnText}>✕</Text>
                  </Pressable>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Current Weekly Goals</Text>
              {goals.filter(g => g.type === 'goal').length === 0 && (
                <Text style={styles.emptyMsg}>No weekly goals added yet.</Text>
              )}
              {goals.filter(g => g.type === 'goal').map(g => (
                <View key={g.id} style={styles.goalItem}>
                  <Text style={styles.goalItemText}>{g.text}</Text>
                  <Pressable style={styles.removeBtn} onPress={() => handleRemove(g.id)}>
                    <Text style={styles.removeBtnText}>✕</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'preferences' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Appearance</Text>
            <Text style={styles.cardSub}>Customize how RemindMe looks</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDesc}>{darkMode ? 'Dark theme enabled' : 'Light theme enabled'}</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ true: '#8b6fd4', false: '#ddd' }}
              />
            </View>
          </View>
        )}

        {activeTab === 'accessibility' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notifications & Sounds</Text>
            <Text style={styles.cardSub}>Manage alerts and reminders</Text>
            {notificationSettings.map((item) => (
              <View key={item.label} style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  <Text style={styles.settingDesc}>{item.desc}</Text>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={item.set}
                  trackColor={{ true: item.color, false: '#ddd' }}
                />
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>{saveConfirm ? '✓ Saved!' : 'Save'}</Text>
        </TouchableOpacity>

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
    justifyContent: 'space-between',
  },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 20, color: '#555' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  signOutBtn: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  signOutText: { fontSize: 14, color: '#555', fontWeight: '600' },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#fff' },
  tabText: { fontSize: 12, color: '#aaa', fontWeight: '600' },
  tabTextActive: { color: '#333' },
  scroll: { paddingHorizontal: 16 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    gap: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSub: { fontSize: 12, color: '#999', marginTop: -6 },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(180,180,200,0.2)',
    alignItems: 'center',
  },
  typeBtnActive: { backgroundColor: '#8b6fd4' },
  typeBtnText: { fontSize: 14, fontWeight: '600', color: '#888' },
  typeBtnTextActive: { color: '#fff' },
  input: {
    backgroundColor: 'rgba(240,235,250,0.8)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#333',
  },
  addBtn: {
    backgroundColor: '#8b6fd4',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(240,235,250,0.6)',
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  goalItemText: { flex: 1, fontSize: 14, color: '#333' },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(220,100,100,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: { fontSize: 14, color: '#c04040', fontWeight: 'bold' },
  emptyMsg: { fontSize: 13, color: '#ccc', textAlign: 'center', paddingVertical: 8, fontStyle: 'italic' },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  settingDesc: { fontSize: 12, color: '#aaa', marginTop: 2 },
  saveText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5bbfb0',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 8,
  },
});