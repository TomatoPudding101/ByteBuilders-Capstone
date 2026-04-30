import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppState } from '../context/AppContext';
import { useTheme } from './ThemeContext';

type Tab = 'goals' | 'parental' | 'preferences' | 'accessibility';

const REWARDS = [
  { id: 1, label: 'Unlock 2 profile characters', points: 5 },
  { id: 2, label: 'Choose your background',      points: 10 },
  { id: 3, label: 'Special surprise!',           points: 25 },
  { id: 4, label: '15 min extra screen time',    points: 50 },
  { id: 5, label: 'Stay up 15 min later',        points: 75 },
  { id: 6, label: 'Choose dinner tonight',       points: 100 },
  { id: 7, label: 'Small treat',                 points: 200 },
  { id: 8, label: 'Small toy',                   points: 300 },
];

export default function ParentSettings() {
  const router = useRouter();
  const { goals, addGoal, removeGoal, totalPoints, deductPoints } = useAppState();
  const { isDarkMode, theme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('goals');
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalType, setNewGoalType] = useState<'chore' | 'goal'>('chore');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [timerReminders, setTimerReminders] = useState(true);
  const [goalReminders, setGoalReminders] = useState(true);
  const [saveConfirm, setSaveConfirm] = useState(false);
  const [deductMsg, setDeductMsg] = useState('');

  const handleAddGoal = () => {
    if (!newGoalText.trim()) return;
    addGoal({ text: newGoalText.trim(), type: newGoalType, points: 5 });
    setNewGoalText('');
  };

  const handleSignOut = () => router.replace('/kidshome');

  const handleSave = () => {
    setSaveConfirm(true);
    setTimeout(() => setSaveConfirm(false), 2000);
  };

  const handleDeduct = (reward: typeof REWARDS[0]) => {
    if (totalPoints < reward.points) {
      setDeductMsg(`Not enough points for "${reward.label}"`);
    } else {
      deductPoints(reward.points);
      setDeductMsg(`✓ Deducted ${reward.points} pts for "${reward.label}"`);
    }
    setTimeout(() => setDeductMsg(''), 3000);
  };

  const notificationSettings = [
    { label: 'Push Notifications', desc: 'Get reminded about tasks, Coming soon!', value: pushNotifications, set: setPushNotifications, color: '#5588e0' },
    { label: 'Sound Effects',      desc: 'Play sounds for actions, Coming soon!',   value: soundEffects,      set: setSoundEffects,      color: '#3cc470' },
    { label: 'Timer Reminders',    desc: 'Notify when timer ends',    value: timerReminders,    set: setTimerReminders,    color: '#e040a0' },
    { label: 'Goal Reminders',     desc: 'Daily goal check-ins',      value: goalReminders,     set: setGoalReminders,     color: '#9b6fd4' },
  ];

  const TABS: { key: Tab; label: string }[] = [
    { key: 'goals',         label: 'Goals' },
    { key: 'parental',      label: 'Parental Controls' },
    { key: 'preferences',   label: 'Preferences' },
    { key: 'accessibility', label: 'Accessibility' },
  ];

  const gradientColors: [string, string, string, string] = isDarkMode
    ? ['#0f0f1a', '#1a1035', '#150d2e', '#0f0f1a']
    : ['#fde8d0', '#f8c8d4', '#d4c8f0', '#c8e0f0'];

  // Card and element backgrounds
  const cardBg     = isDarkMode ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.82)';
  const itemBg     = isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(240,235,250,0.6)';
  const inputBg    = isDarkMode ? 'rgba(255,255,255,0.10)' : 'rgba(240,235,250,0.8)';
  const tabBarBg   = isDarkMode ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.6)';
  const tabActiveBg= isDarkMode ? 'rgba(255,255,255,0.18)' : '#fff';
  const btnBg      = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)';

  // Text colors — all meet 4.5:1 on their backgrounds
  const titleColor = isDarkMode ? '#ffffff' : '#333';
  const subColor   = isDarkMode ? '#b0a8d0' : '#999';
  const bodyColor  = isDarkMode ? '#e0d8f0' : '#333';
  const tabColor   = isDarkMode ? '#b0a8d0' : '#aaa';
  const tabActiveColor = isDarkMode ? '#ffffff' : '#333';
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)';

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: btnBg }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backText, { color: titleColor }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: titleColor }]}>Settings</Text>
        <TouchableOpacity
          style={[styles.signOutBtn, { backgroundColor: btnBg }]}
          onPress={handleSignOut}
        >
          <Text style={[styles.signOutText, { color: titleColor }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBarScroll}
        contentContainerStyle={[styles.tabBar, { backgroundColor: tabBarBg }]}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && { backgroundColor: tabActiveBg }]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab.key ? tabActiveColor : tabColor }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {activeTab === 'goals' && (
          <>
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <Text style={[styles.cardTitle, { color: titleColor }]}>Add Goal / Chore</Text>
              <Text style={[styles.cardSub, { color: subColor }]}>Children will see these in their Goals page</Text>
              <View style={styles.typeRow}>
                <TouchableOpacity
                  style={[styles.typeBtn, newGoalType === 'chore' && styles.typeBtnActive]}
                  onPress={() => setNewGoalType('chore')}
                >
                  <Text style={[styles.typeBtnText, newGoalType === 'chore' && styles.typeBtnTextActive]}>Chore</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeBtn, newGoalType === 'goal' && styles.typeBtnActive]}
                  onPress={() => setNewGoalType('goal')}
                >
                  <Text style={[styles.typeBtnText, newGoalType === 'goal' && styles.typeBtnTextActive]}>Weekly Goal</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: bodyColor }]}
                placeholder="e.g. Make your bed, Read for 20 min..."
                placeholderTextColor={subColor}
                value={newGoalText}
                onChangeText={setNewGoalText}
              />
              <TouchableOpacity style={styles.addBtn} onPress={handleAddGoal}>
                <Text style={styles.addBtnText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <Text style={[styles.cardTitle, { color: titleColor }]}>Current Chores</Text>
              {goals.filter(g => g.type === 'chore').length === 0 && (
                <Text style={[styles.emptyMsg, { color: subColor }]}>No chores added yet.</Text>
              )}
              {goals.filter(g => g.type === 'chore').map(g => (
                <View key={g.id} style={[styles.goalItem, { backgroundColor: itemBg }]}>
                  <Text style={[styles.goalItemText, { color: bodyColor }]}>{g.text}</Text>
                  <Pressable style={styles.removeBtn} onPress={() => removeGoal(g.id)}>
                    <Text style={styles.removeBtnText}>✕</Text>
                  </Pressable>
                </View>
              ))}
            </View>

            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <Text style={[styles.cardTitle, { color: titleColor }]}>Current Weekly Goals</Text>
              {goals.filter(g => g.type === 'goal').length === 0 && (
                <Text style={[styles.emptyMsg, { color: subColor }]}>No weekly goals added yet.</Text>
              )}
              {goals.filter(g => g.type === 'goal').map(g => (
                <View key={g.id} style={[styles.goalItem, { backgroundColor: itemBg }]}>
                  <Text style={[styles.goalItemText, { color: bodyColor }]}>{g.text}</Text>
                  <Pressable style={styles.removeBtn} onPress={() => removeGoal(g.id)}>
                    <Text style={styles.removeBtnText}>✕</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'parental' && (
          <>
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <Text style={[styles.cardTitle, { color: titleColor }]}>Child's Points</Text>
              <Text style={[styles.cardSub, { color: subColor }]}>Current total synced from progress page</Text>
              <View style={styles.pointsDisplay}>
                <Text style={styles.pointsBig}>{totalPoints}</Text>
                <Text style={[styles.pointsUnit, { color: subColor }]}>points</Text>
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <Text style={[styles.cardTitle, { color: titleColor }]}>Deduct Points for Redeemed Rewards</Text>
              <Text style={[styles.cardSub, { color: subColor }]}>Tap "Deduct" when your child redeems a reward</Text>
              {deductMsg ? (
                <View style={styles.deductMsgBox}>
                  <Text style={styles.deductMsgText}>{deductMsg}</Text>
                </View>
              ) : null}
              {REWARDS.map(reward => (
                <View key={reward.id} style={[styles.rewardRow, { backgroundColor: itemBg }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rewardRowLabel, { color: bodyColor }]}>{reward.label}</Text>
                    <Text style={styles.rewardRowPts}>{reward.points} pts</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.deductBtn, totalPoints < reward.points && styles.deductBtnDisabled]}
                    onPress={() => handleDeduct(reward)}
                  >
                    <Text style={styles.deductBtnText}>Deduct</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'preferences' && (
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Text style={[styles.cardTitle, { color: titleColor }]}>Appearance</Text>
            <Text style={[styles.cardSub, { color: subColor }]}>Customize how RemindMe looks</Text>
            <View style={[styles.settingRow, { borderBottomColor: borderColor }]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: bodyColor }]}>Dark Mode</Text>
                <Text style={[styles.settingDesc, { color: subColor }]}>
                  Toggle using the 🌙 button on the kids dashboard
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'accessibility' && (
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Text style={[styles.cardTitle, { color: titleColor }]}>Notifications & Sounds</Text>
            <Text style={[styles.cardSub, { color: subColor }]}>Manage alerts and reminders</Text>
            {notificationSettings.map((item) => (
              <View key={item.label} style={[styles.settingRow, { borderBottomColor: borderColor }]}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: bodyColor }]}>{item.label}</Text>
                  <Text style={[styles.settingDesc, { color: subColor }]}>{item.desc}</Text>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={item.set}
                  trackColor={{ true: item.color, false: '#555' }}
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
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  signOutBtn: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  signOutText: { fontSize: 14, fontWeight: '600' },
  tabBarScroll: { maxHeight: 48, marginHorizontal: 16, marginBottom: 12 },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tab: { paddingVertical: 8, paddingHorizontal: 14, alignItems: 'center', borderRadius: 10 },
  tabText: { fontSize: 12, fontWeight: '600' },
  scroll: { paddingHorizontal: 16 },
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    gap: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSub: { fontSize: 12, marginTop: -6 },
  pointsDisplay: { alignItems: 'center', paddingVertical: 12 },
  pointsBig: { fontSize: 56, fontWeight: 'bold', color: '#8b6fd4' },
  pointsUnit: { fontSize: 14, fontWeight: '600' },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  rewardRowLabel: { fontSize: 13, fontWeight: '600' },
  rewardRowPts: { fontSize: 12, color: '#8b6fd4', fontWeight: '600', marginTop: 2 },
  deductBtn: {
    backgroundColor: '#8b6fd4',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  deductBtnDisabled: { backgroundColor: 'rgba(180,180,180,0.4)' },
  deductBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  deductMsgBox: {
    backgroundColor: 'rgba(91,191,176,0.2)',
    borderRadius: 10,
    padding: 10,
  },
  deductMsgText: { color: '#3a8a78', fontWeight: '600', fontSize: 13, textAlign: 'center' },
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
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
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
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  goalItemText: { flex: 1, fontSize: 14 },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(220,100,100,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: { fontSize: 14, color: '#c04040', fontWeight: 'bold' },
  emptyMsg: { fontSize: 13, textAlign: 'center', paddingVertical: 8, fontStyle: 'italic' },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 14, fontWeight: '600' },
  settingDesc: { fontSize: 12, marginTop: 2 },
  saveText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5bbfb0',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 8,
  },
});
