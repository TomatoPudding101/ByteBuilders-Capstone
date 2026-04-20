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

type Reminder = {
  id?: string;
  title: string;
  time: string;
  date: string;
  notes: string;
  completed: boolean;
};

const STREAK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function KidsProgress() {
  const router = useRouter();
  const [streak] = useState(0);
  const [progress, setProgress] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [goalsCompleted, setGoalsCompleted] = useState(0);

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderTime, setReminderTime] = useState(new Date());
  const [reminderDate, setReminderDate] = useState(new Date());
  const [reminderNotes, setReminderNotes] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const kidUid = auth().currentUser?.uid;

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
        const completed = loaded.filter((r) => r.completed).length;
        setGoalsCompleted(completed);
        setProgress(
          loaded.length === 0
            ? 0
            : Math.round((completed / loaded.length) * 100),
        );
      });
    return unsub;
  }, [kidUid]);

  useEffect(() => {
    if (!kidUid) return;
    const unsub = firestore()
      .collection("kids")
      .doc(kidUid)
      .onSnapshot((doc: any) => {
        if (doc.exists) setTotalPoints(doc.data()?.points ?? 0);
      });
    return unsub;
  }, [kidUid]);

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
    if (kidUid) {
      firestore()
        .collection("kids")
        .doc(kidUid)
        .collection("reminders")
        .add(newReminder);
    }

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

  const totalTasks = reminders.length;
  const completedToday = reminders.filter((r) => r.completed).length;

  const stats = [
    { label: "Today's Progress", value: `${progress}%`, color: "#8b6fd4" },
    { label: "Completed Today", value: `${completedToday}`, color: "#4db89a" },
    {
      label: "Tasks Left",
      value: `${totalTasks - completedToday}`,
      color: "#5588e0",
    },
    { label: "Total Points", value: `${totalPoints}`, color: "#d4a020" },
  ];

  return (
    <LinearGradient
      colors={["#fde8d0", "#f8c8d4", "#d4c8f0", "#c8e0f0"]}
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: "#e8d5f8" }]}>
            <Text style={[styles.summaryValue, { color: "#7040b0" }]}>
              {totalPoints}
            </Text>
            <Text style={[styles.summaryLabel, { color: "#9060c0" }]}>
              Total Points
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: "#d5f0e8" }]}>
            <Text style={[styles.summaryValue, { color: "#208060" }]}>
              {streak}
            </Text>
            <Text style={[styles.summaryLabel, { color: "#308070" }]}>
              Day Streak
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: "#d5e8f8" }]}>
            <Text style={[styles.summaryValue, { color: "#205090" }]}>
              {goalsCompleted}
            </Text>
            <Text style={[styles.summaryLabel, { color: "#306080" }]}>
              Goals Done
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today`s Progress</Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: progress > 0 ? `${progress}%` : 8 },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>{progress}% Complete</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Day Streak</Text>
          <View style={styles.streakRow}>
            {STREAK_DAYS.map((d, i) => (
              <View
                key={i}
                style={[styles.streakDay, i < streak && styles.streakDayActive]}
              >
                <Text
                  style={[
                    styles.streakDayText,
                    i < streak && styles.streakDayTextActive,
                  ]}
                >
                  {d}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.streakMsg}>
            {streak === 0
              ? "Start your streak today!"
              : `Amazing! ${streak} day streak!`}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Stats</Text>
          <View style={styles.statsGrid}>
            {stats.map((s, i) => (
              <View
                key={i}
                style={[
                  styles.statCard,
                  { borderTopColor: s.color, borderTopWidth: 3 },
                ]}
              >
                <Text style={[styles.statValue, { color: s.color }]}>
                  {s.value}
                </Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add Reminder</Text>
        </TouchableOpacity>

        {reminders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No reminders yet</Text>
            <TouchableOpacity style={styles.addFirstButton}>
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
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#333" },
  headerSub: { fontSize: 13, fontWeight: "600", color: "#e06080" },
  scroll: { paddingHorizontal: 16 },
  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  summaryCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: "center" },
  summaryValue: { fontSize: 28, fontWeight: "bold" },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 2,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 12,
  },
  progressBarBg: {
    height: 20,
    backgroundColor: "rgba(180,180,220,0.3)",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#8b6fd4",
    borderRadius: 10,
  },
  progressLabel: {
    fontSize: 13,
    color: "#888",
    textAlign: "right",
    marginTop: 6,
  },
  streakRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  streakDay: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(180,180,220,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  streakDayActive: { backgroundColor: "#f0a030" },
  streakDayText: { fontSize: 13, fontWeight: "700", color: "#aaa" },
  streakDayTextActive: { color: "#fff" },
  streakMsg: { fontSize: 13, color: "#888", textAlign: "center" },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  statCard: {
    width: "47%",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 28, fontWeight: "bold" },
  statLabel: { fontSize: 11, color: "#888", textAlign: "center", marginTop: 4 },
  addButton: {
    backgroundColor: "#8b6fd4",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 14,
  },
  addButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  emptyCard: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    gap: 16,
  },
  emptyText: { fontSize: 15, color: "#aaa" },
  addFirstButton: {
    backgroundColor: "#8b6fd4",
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
