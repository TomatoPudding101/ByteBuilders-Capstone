import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

const auth = require("@react-native-firebase/auth").default;
const firestore = require("@react-native-firebase/firestore").default;

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const NUM_CHORES = 7;

export default function GoalsTrackerScreen() {
  const router = useRouter();

  // Daily Chores state
  const [chores, setChores] = useState<string[]>(Array(NUM_CHORES).fill(""));
  const [checked, setChecked] = useState<boolean[][]>(
    Array(NUM_CHORES)
      .fill(null)
      .map(() => Array(7).fill(false)),
  );

  // Weekly Goals state
  const [weeklyGoals, setWeeklyGoals] = useState<string[]>(Array(7).fill(""));
  const [goalDone, setGoalDone] = useState<boolean[]>(Array(7).fill(false));

  // Notes state
  const [notes, setNotes] = useState("");

  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Progress stats (static for demo)
  const totalTasks = reminders.length;
  const completedToday = reminders.filter((r) => r.completed).length;
  const tasksLeft = totalTasks - completedToday;
  const progressPct =
    totalTasks === 0 ? 0 : Math.round(completedToday / totalTasks);

  const stats = [
    { label: "Today's Progress", value: `${progressPct}%`, color: "#8060d0" },
    { label: "Completed Today", value: `${completedToday}`, color: "#50c0a0" },
    { label: "Current Streak", value: "0", color: "#e08030" },
    { label: "Best Streak", value: "0", color: "#d4a020" },
    {
      label: "Tasks Left to Complete",
      value: `${tasksLeft}`,
      color: "#3cc470",
    },
  ];

  const toggleCheck = (row: number, col: number) => {
    const updated = checked.map((r, ri) =>
      r.map((c, ci) => (ri === row && ci === col ? !c : c)),
    );
    setChecked(updated);
  };

  const toggleGoal = (i: number) => {
    const updated = [...goalDone];
    updated[i] = !updated[i];
    setGoalDone(updated);
  };

  type Reminder = {
    id?: string;
    title: string;
    time: string;
    date: string;
    notes: string;
    completed: boolean;
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderTime, setReminderTime] = useState(new Date());
  const [reminderDate, setReminderDate] = useState(new Date());
  const [reminderNotes, setReminderNotes] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const kidUid = Platform.OS !== "web" ? auth().currentUser?.uid : null;

  useEffect(() => {
    if (!kidUid) return;
    const unsub = firestore()
      .collection("kids")
      .doc(kidUid)
      .collection("reminders")
      .onSnapshot((snap: any) => {
        const loaded: Reminder[] = snap.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReminders(loaded);
      });
    return unsub;
  }, [kidUid]);

  const saveReminder = async (reminder: Reminder) => {
    if (!kidUid) return;
    await firestore()
      .collection("kids")
      .doc(kidUid)
      .collection("reminders")
      .add(reminder);
  };

  const handleCreateReminder = () => {
    if (!reminderTitle.trim()) return Alert.alert("Please enter a title.");
    const newReminder: Reminder = {
      title: reminderTitle,
      time: reminderTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: reminderDate.toDateString(),
      notes: reminderNotes,
      completed: false,
    };
    saveReminder(newReminder);
    setReminderTitle("");
    setReminderTime(new Date());
    setReminderDate(new Date());
    setReminderNotes("");
    setModalVisible(false);
  };

  const handleCompleteReminder = async (id: string, current: boolean) => {
    if (!kidUid) return;
    await firestore()
      .collection("kids")
      .doc(kidUid)
      .collection("reminders")
      .doc(id)
      .update({ completed: !current });
  };

  const handleDeleteReminder = async (id: string) => {
    if (!kidUid) return;
    await firestore()
      .collection("kids")
      .doc(kidUid)
      .collection("reminders")
      .doc(id)
      .delete();
  };

  return (
    <LinearGradient
      colors={["#fde8d0", "#f8c8d4", "#d4c8f0", "#c8e0f0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextArea}>
          <Text style={styles.headerTitle}>Goals / Chores</Text>
          <Text style={styles.headerSub}>One Step at a Time!</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── DAILY CHORES ── */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Chores</Text>
            <View style={styles.dayRow}>
              {DAYS.map((d, i) => (
                <Text key={i} style={styles.dayLabel}>
                  {d}
                </Text>
              ))}
            </View>
          </View>

          {Array(NUM_CHORES)
            .fill(null)
            .map((_, ri) => (
              <View key={ri} style={styles.choreRow}>
                <Text style={styles.choreNum}>{ri + 1}.</Text>
                <TextInput
                  style={styles.choreInput}
                  placeholder="___________"
                  placeholderTextColor="#bbb"
                  value={chores[ri]}
                  onChangeText={(t) => {
                    const updated = [...chores];
                    updated[ri] = t;
                    setChores(updated);
                  }}
                />
                <View style={styles.checkRow}>
                  {DAYS.map((_, ci) => (
                    <Pressable
                      key={ci}
                      style={[
                        styles.checkbox,
                        checked[ri][ci] && styles.checkboxChecked,
                      ]}
                      onPress={() => toggleCheck(ri, ci)}
                    >
                      {checked[ri][ci] && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
        </View>

        {/* ── WEEKLY GOALS ── */}
        <View style={styles.card}>
          <View style={styles.weeklyHeader}>
            <Text style={styles.sectionTitle}>Weekly Goals</Text>
          </View>
          {DAYS.map((d, i) => (
            <View key={i} style={styles.goalRow}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>{d}</Text>
              </View>
              <TextInput
                style={styles.goalInput}
                placeholder="___________"
                placeholderTextColor="#bbb"
                value={weeklyGoals[i]}
                onChangeText={(t) => {
                  const updated = [...weeklyGoals];
                  updated[i] = t;
                  setWeeklyGoals(updated);
                }}
              />
              <Pressable
                style={[styles.goalCheck, goalDone[i] && styles.goalCheckDone]}
                onPress={() => toggleGoal(i)}
              >
                {goalDone[i] && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>
            </View>
          ))}
        </View>

        {/* ── NOTES ── */}
        <View style={styles.card}>
          <View style={styles.notesHeader}>
            <Text style={styles.sectionTitle}>NOTES</Text>
          </View>
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={5}
            placeholder="* &#10;* &#10;*"
            placeholderTextColor="#bbb"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* ── PROGRESS STATS ── */}
        <View style={styles.card}>
          <Text style={styles.progressTitle}>My Progress</Text>
          <Text style={styles.progressSub}>Keep up the Good Work!</Text>
          <View style={styles.statsGrid}>
            {stats.map((s, i) => (
              <View key={i} style={styles.statCard}>
                <Text style={[styles.statValue, { color: s.color }]}>
                  {s.value}
                </Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── ADD REMINDER ── */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add Reminder</Text>
        </TouchableOpacity>

        {reminders.length === 0 ? (
          <View style={styles.emptyReminders}>
            <Text style={styles.emptyText}>No reminders yet</Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addButtonText}>
                + Add Your First Reminder
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          reminders.map((r) => (
            <View
              key={r.id}
              style={[styles.reminderCard, r.completed && { opacity: 0.5 }]}
            >
              <Pressable
                onPress={() => handleCompleteReminder(r.id!, r.completed)}
                style={styles.reminderCheck}
              >
                <Text style={{ fontSize: 18 }}>
                  {r.completed ? "✅" : "⬜"}
                </Text>
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.reminderTitle,
                    r.completed && { textDecorationLine: "line-through" },
                  ]}
                >
                  {r.title}
                </Text>
                <Text style={styles.reminderMeta}>
                  {r.date} • {r.time}
                </Text>
                {r.notes ? (
                  <Text style={styles.reminderNotesText}>{r.notes}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteReminder(r.id!)}
                style={{ padding: 6 }}
              >
                <Text style={{ fontSize: 18 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>➕ New Reminder</Text>

              <Text style={styles.modalLabel}>Title</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="What do you need to do?"
                placeholderTextColor="#bbb"
                value={reminderTitle}
                onChangeText={setReminderTitle}
              />

              <Text style={styles.modalLabel}>Time</Text>
              <TouchableOpacity
                style={styles.pickerBtn}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.pickerBtnText}>
                  🕐{" "}
                  {reminderTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={reminderTime}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_: any, date?: Date) => {
                    setShowTimePicker(false);
                    if (date) setReminderTime(date);
                  }}
                />
              )}

              <Text style={styles.modalLabel}>Date</Text>
              <TouchableOpacity
                style={styles.pickerBtn}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.pickerBtnText}>
                  📅 {reminderDate.toDateString()}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={reminderDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_: any, date?: Date) => {
                    setShowDatePicker(false);
                    if (date) setReminderDate(date);
                  }}
                />
              )}

              <Text style={styles.modalLabel}>Notes</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  { height: 80, textAlignVertical: "top" },
                ]}
                placeholder="Any extra details..."
                placeholderTextColor="#bbb"
                multiline
                value={reminderNotes}
                onChangeText={setReminderNotes}
              />

              <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
                <TouchableOpacity
                  style={[
                    styles.modalBtn,
                    { backgroundColor: "#ddd", flex: 1 },
                  ]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text
                    style={{
                      color: "#555",
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalBtn,
                    { backgroundColor: "#7755cc", flex: 1 },
                  ]}
                  onPress={handleCreateReminder}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingBottom: 20 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { fontSize: 20, color: "#555" },
  headerTextArea: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#333" },
  headerSub: { fontSize: 13, fontWeight: "600", color: "#e06080" },

  // Cards
  card: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },

  // Daily Chores
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    backgroundColor: "rgba(180,230,200,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  dayRow: { flexDirection: "row", gap: 4, marginLeft: "auto" },
  dayLabel: {
    width: 24,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: "#9b6fd4",
  },
  choreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 4,
  },
  choreNum: { fontSize: 12, color: "#666", width: 18 },
  choreInput: {
    flex: 1,
    fontSize: 13,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 2,
  },
  checkRow: { flexDirection: "row", gap: 3 },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: "#aaa",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#80d4a0",
    borderColor: "#50b870",
  },
  checkmark: { fontSize: 13, color: "#fff", fontWeight: "bold" },

  // Weekly Goals
  weeklyHeader: {
    alignItems: "center",
    marginBottom: 12,
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  dayBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0d0e8",
    alignItems: "center",
    justifyContent: "center",
  },
  dayBadgeText: { fontSize: 12, fontWeight: "700", color: "#9b6fd4" },
  goalInput: {
    flex: 1,
    fontSize: 13,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 2,
  },
  goalCheck: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: "#aaa",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  goalCheckDone: {
    backgroundColor: "#9b6fd4",
    borderColor: "#7a50b0",
  },

  // Notes
  notesHeader: {
    backgroundColor: "rgba(220,190,150,0.4)",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 4,
    marginBottom: 10,
  },
  notesInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#333",
    minHeight: 100,
    textAlignVertical: "top",
  },

  // Progress
  progressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  progressSub: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  statCard: {
    width: "47%",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 26, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#666", textAlign: "center", marginTop: 2 },

  // Reminders
  addButton: {
    backgroundColor: "#7755cc",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  emptyReminders: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    gap: 16,
  },
  emptyText: { fontSize: 15, color: "#999" },
  addFirstButton: {
    backgroundColor: "#7755cc",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },

  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    gap: 10,
  },
  reminderCheck: { padding: 4 },
  reminderTitle: { fontSize: 15, fontWeight: "700", color: "#333" },
  reminderMeta: { fontSize: 15, color: "#888", marginTop: 2 },
  reminderNotesText: { fontSize: 12, color: "#aaa", marginTop: 2 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#7755cc",
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
    marginBottom: 6,
    marginTop: 12,
  },
  modalInput: {
    backgroundColor: "#f5f0ff",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pickerBtn: {
    backgroundColor: "#f5f0ff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pickerBtnText: { fontSize: 14, color: "#555", fontWeight: "600" },
  modalBtn: { borderRadius: 10, paddingVertical: 12 },
});
