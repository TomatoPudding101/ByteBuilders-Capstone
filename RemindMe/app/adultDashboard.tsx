import { useTheme } from "./ThemeContext";

import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useUser } from "./userContext";

const firestore = require("@react-native-firebase/firestore").default;

let persistentReminders: {
  title: string;
  time: string;
  date?: string;
  notes: string;
  completed: boolean;
}[] = [];

const AdultDashboard = () => {
  const router = useRouter();
  const { isDarkMode, theme } = useTheme();
  const { currentUser, currentUserId } = useUser();
  const [isReminderModalVisible, setIsReminderModalVisible] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderTime, setReminderTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderDate, setReminderDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminderNotes, setReminderNotes] = useState("");

  const [isListening, setIsListening] = useState(false);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");

  const [reminderList, setReminders] = useState(persistentReminders);

  useEffect(() => {
    if (!currentUserId) return;
    persistentReminders = [];
    setReminders([]);

    if (!__DEV__ || currentUserId !== "devuser") {
      try {
        const unsubscribe = firestore()
          .collection("users")
          .doc(currentUserId)
          .collection("reminders")
          .onSnapshot((snapshot: any) => {
            const loaded = snapshot.docs.map((doc: any) => ({
              id: doc.id,
              ...doc.data(),
            }));
            persistentReminders = loaded;
            setReminders(loaded);
          });
        return unsubscribe;
      } catch {
        console.log("Firestore not available in this enviornment");
      }
    }
  }, [currentUserId]);

  useEffect(() => {
    if (voiceModalVisible) {
      const timer = setTimeout(() => {
        try {
          ExpoSpeechRecognitionModule.start({
            lang: "en-US",
            interimResults: true,
          });
        } catch (e) {
          console.log("Start error:", e);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [voiceModalVisible]);

  useSpeechRecognitionEvent("start", () => setIsListening(true));
  useSpeechRecognitionEvent("end", () => setIsListening(false));
  useSpeechRecognitionEvent("result", (event) => {
    const text = event.results[0]?.transcript ?? "";
    setVoiceTranscript(text);
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.log("Speech error:", event.error);
    setIsListening(false);
  });

  const handleMicPress = () => {
    setVoiceTranscript("");
    setIsListening(false);
    setVoiceModalVisible(true);
  };

  const parseTimeFromTranscript = (text: string): Date => {
    const time = new Date();

    const match =
      text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m|p\.m)/i) ||
      text.match(/(\d{1,2})(?::(\d{2}))?\s*o'?clock/i);

    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2] ? parseInt(match[2]) : 0;
      const period = match[3]?.toLowerCase();

      if (period?.startsWith("p") && hours !== 12) hours += 12;
      if (period?.startsWith("a") && hours === 12) hours = 0;

      time.setHours(hours, minutes, 0, 0);
    }
    return time;
  };

  const parseDateFromTranscript = (text: string): string => {
    const lower = text.toLowerCase();
    const today = new Date();

    if (lower.includes("today")) {
      return today.toDateString();
    }

    if (lower.includes("tomorrow")) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return tomorrow.toDateString();
    }

    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    for (let i = 0; i < months.length; i++) {
      const match = lower.match(
        new RegExp(`${months[i]}\\s+(\\d{1,2})(?:st|nd|rd|th)?`),
      );
      if (match) {
        const day = parseInt(match[1]);
        const year = today.getFullYear();
        const date = new Date(year, i, day);
        if (date < today) date.setFullYear(year + 1);
        return date.toDateString();
      }
    }

    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    for (let i = 0; i < days.length; i++) {
      if (
        lower.includes(`next ${days[i]}`) ||
        lower.includes(`this ${days[i]}`)
      ) {
        const target = new Date(today);
        const diff = (i + 7 - today.getDay()) % 7 || 7;
        target.setDate(today.getDate() + diff);
        return target.toDateString();
      }
    }

    for (let i = 0; i < days.length; i++) {
      if (lower.includes(days[i])) {
        const target = new Date(today);
        const diff = (i + 7 - today.getDay()) % 7 || 7;
        target.setDate(today.getDate() + diff);
        return target.toDateString();
      }
    }
    return today.toDateString();
  };

  const cleanTranscriptTitle = (text: string): string => {
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    let cleaned = text
      .replace(/\bat\s+\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m|p\.m)?/gi, "")
      .replace(/\b(?:today|tomorrow)\b/gi, "")
      .replace(
        new RegExp(
          `\\b(?:on\\s+)?(?:${months.join("|")})\\s+\\d{1,2}(?:st|nd|rd|th)?\\b`,
          "gi",
        ),
        "",
      )
      .replace(
        /\b(?:next|this)\s+(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/gi,
        "",
      )

      .replace(
        /\b(?:on\s+)?(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/gi,
        "",
      )
      .replace(/\s{2,}/g, " ")
      .trim();

    return cleaned;
  };

  const handleVoiceCommand = (text: string): boolean => {
    const lower = text.toLowerCase();

    if (
      lower.includes("all done") ||
      lower.includes("finished all") ||
      lower.includes("mark all complete") ||
      lower.includes("complete all") ||
      lower.includes("finish all") ||
      lower.includes("all complete") ||
      lower.includes("all tasks complete") ||
      lower.includes("all tasks done") ||
      lower.includes("everything done") ||
      lower.includes("everything complete")
    ) {
      const uncompletedCount = persistentReminders.filter(
        (r) => !r.completed,
      ).length;
      const newList = persistentReminders.map((r) => ({
        ...r,
        completed: true,
      }));
      updateReminders(() => newList);
      saveReminders(newList);

      firestore()
        .collection("users")
        .doc(currentUserId!)
        .collection("stats")
        .doc("progressStats")
        .get()
        .then((doc: any) => {
          const stats =
            doc.exists && doc.data()
              ? doc.data()
              : {
                  completed: 0,
                  streak: 0,
                  activeDays: 0,
                  missedDays: 0,
                  lastCompletedDate: null,
                };
          stats.completed += uncompletedCount;
          stats.activeDays += uncompletedCount;
          const today = new Date().toDateString();
          if (stats.lastCompletedDate !== today) {
            stats.streak += 1;
            stats.lastCompletedDate = today;
          }
          firestore()
            .collection("users")
            .doc(currentUserId!)
            .collection("stats")
            .doc("progressStats")
            .set(stats);
        });

      setVoiceModalVisible(false);
      setVoiceTranscript("");
      Alert.alert("All reminders marked completed.");
      return true;
    }

    const matchPatterns = [
      /mark (.+?) (?:as )?(?:complete|done|finished)/i,
      /(.+?) (?:is )?(?:complete|done|finished)/i,
      /complete (.+)/i,
      /finish (.+)/i,
      /(.+?) completed/i,
      /(.+?) done/i,
    ];

    for (const pattern of matchPatterns) {
      const match = text.match(pattern);
      if (match) {
        const spokenTitle = match[1].toLowerCase().trim();
        const index = persistentReminders.findIndex((r) =>
          r.title.toLowerCase().includes(spokenTitle),
        );
        if (index !== -1) {
          const newList = persistentReminders.map((r, i) =>
            i === index ? { ...r, completed: true } : r,
          );
          updateReminders(() => newList);
          saveReminders(newList);

          firestore()
            .collection("users")
            .doc(currentUserId!)
            .collection("stats")
            .doc("progressStats")
            .get()
            .then((doc: any) => {
              const stats =
                doc.exists && doc.data()
                  ? doc.data()
                  : {
                      completed: 0,
                      streak: 0,
                      activeDays: 0,
                      missedDays: 0,
                      lastCompletedDate: null,
                    };
              if (!persistentReminders[index].completed) {
                stats.completed += 1;
                stats.activeDays += 1;
                const today = new Date().toDateString();
                if (stats.lastCompletedDate !== today) {
                  stats.streak += 1;
                  stats.lastCompletedDate = today;
                }
              }
              firestore()
                .collection("users")
                .doc(currentUserId!)
                .collection("stats")
                .doc("progressStats")
                .set(stats);
            });

          setVoiceModalVisible(false);
          setVoiceTranscript("");
          Alert.alert(
            `"${persistentReminders[index].title}" marked as completed.`,
          );
          return true;
        }
      }
    }
    return false;
  };

  const handleSaveVoiceReminder = () => {
    if (!voiceTranscript.trim()) return;
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch {}

    const wasCommand = handleVoiceCommand(voiceTranscript);
    if (wasCommand) return;
    const parsedTime = parseTimeFromTranscript(voiceTranscript);
    const parsedDate = parseDateFromTranscript(voiceTranscript);
    const cleanTitle = cleanTranscriptTitle(voiceTranscript);

    const newList = [
      ...persistentReminders,
      {
        title: cleanTitle,
        time: parsedTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: parsedDate,
        notes: "Created with voice",
        completed: false,
      },
    ];
    updateReminders(() => newList);
    saveReminders(newList);
    setVoiceModalVisible(false);
    setVoiceTranscript("");
  };

  const updateReminders = (
    updater: (prev: typeof persistentReminders) => typeof persistentReminders,
  ) => {
    setReminders((prev) => {
      const next = updater(prev);
      persistentReminders = next;
      return next;
    });
  };

  const saveReminders = async (reminders: typeof persistentReminders) => {
    if (!currentUserId) return;
    try {
      const ref = firestore()
        .collection("users")
        .doc(currentUserId)
        .collection("reminders");

      const existing = await ref.get();
      const batch = firestore().batch();
      existing.docs.forEach((doc: any) => batch.delete(doc.ref));
      reminders.forEach((r) => {
        const newRef = ref.doc();
        batch.set(newRef, r);
      });
      await batch.commit();
    } catch (e) {
      console.error("Error saving reminders", e);
    }
  };

  const handleCreateReminder = () => {
    if (!reminderTitle.trim()) return;
    const newList = [
      ...persistentReminders,
      {
        title: reminderTitle,
        time: reminderTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: reminderDate.toDateString(),
        notes: reminderNotes,
        completed: false,
      },
    ];

    updateReminders(() => newList);
    saveReminders(newList);
    setReminderTitle("");
    setReminderTime(new Date());
    setReminderDate(new Date());
    setReminderNotes("");
    setIsReminderModalVisible(false);
  };

  const handleCompleteReminder = (index: number) => {
    const wasCompleted = persistentReminders[index].completed;
    const newList = persistentReminders.map((r, i) =>
      i === index ? { ...r, completed: !r.completed } : r,
    );
    updateReminders(() => newList);
    saveReminders(newList);

    if (__DEV__ && currentUserId === "devuser") return;
    try {
      firestore()
        .collection("users")
        .doc(currentUserId!)
        .collection("stats")
        .doc("progressStats")
        .get()
        .then((doc: any) => {
          const stats =
            doc.exists && doc.data()
              ? doc.data()
              : {
                  completed: 0,
                  streak: 0,
                  activeDays: 0,
                  missedDays: 0,
                  lastCompletedDate: null,
                };
          if (!wasCompleted) {
            stats.completed += 1;
            stats.activeDays += 1;
            const today = new Date().toDateString();
            if (stats.lastCompletedDate !== today) {
              stats.streak += 1;
              stats.lastCompletedDate = today;
            }
          } else {
            stats.completed = Math.max(0, stats.completed - 1);
          }

          firestore()
            .collection("users")
            .doc(currentUserId!)
            .collection("stats")
            .doc("progressStats")
            .set(stats);

          if (!wasCompleted && stats.streak >= 2) {
            Alert.alert(
              "🔥 You're on a streak!",
              `${stats.streak} days in a row! Keep it up!`,
            );
          }
        });
    } catch {
      console.log("Firestore not available in this enviornment");
    }
  };

  const handleDeleteReminder = (index: number) => {
    const newList = persistentReminders.filter((_, i) => i !== index);
    updateReminders(() => newList);
    saveReminders(newList);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <LinearGradient
        colors={
          isDarkMode
            ? ["#1f2937", "#1f2937"]
            : ["#fff0f0", "#f0f4ff", "#f0fff4"]
        }
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dashboardTitle}>Dashboard</Text>
          <View style={styles.userInfo}>
            <Ionicons name="person-circle-outline" size={16} color="#666" />
            <Text style={styles.username}>{currentUser ?? "Guest"}</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <View
          style={[
            styles.statCard,
            styles.statCardLeft,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <Text style={styles.statNumber}>{reminderList.length}</Text>
          <Text style={styles.statLabel}>Total Reminders</Text>
        </View>
        <View
          style={[
            styles.statCard,
            styles.statCardRight,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <Text style={[styles.statNumber, styles.statNumberOrange]}>
            {reminderList.length}
          </Text>
          <Text style={styles.statLabel}>Todays Tasks</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View
          style={[
            styles.statCard,
            styles.statCardLeft,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <Text style={[styles.statNumber, styles.statNumberCyan]}>
            {reminderList.filter((r) => r.completed).length}
          </Text>
          <Text style={styles.statLabel}>Completed Today</Text>
        </View>
        <View
          style={[
            styles.statCard,
            styles.statCardRight,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <Text style={[styles.statNumber, styles.statNumberPurple]}>
            {reminderList.length === 0
              ? "0%"
              : Math.round(
                  (reminderList.filter((r) => r.completed).length /
                    reminderList.length) *
                    100,
                ) + "%"}
          </Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>

      {/* Action Icons Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionIcon} onPress={handleMicPress}>
          <Ionicons
            name={isListening ? "mic" : "mic-outline"}
            size={24}
            color={isListening ? "#9333ea" : "#666"}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIcon}>
          <Ionicons name="notifications-outline" size={24} color="#666" />
        </TouchableOpacity>

        {reminderList.length >= 2 && (
          <View
            style={{
              backgroundColor: isDarkMode ? theme.cardBackground : "#9333EA",
              borderRadius: 12,
              padding: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => setIsReminderModalVisible(true)}
              style={{
                backgroundColor: "#933ea",
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: isDarkMode ? theme.text : "white",
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                + Add Reminder
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Your Reminders Section */}
      <TouchableOpacity style={styles.remindersHeader}>
        <Ionicons name="calendar-outline" size={20} color="#9333EA" />
        <Text style={styles.remindersHeaderText}>Your Reminders</Text>
      </TouchableOpacity>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {reminderList.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={60} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>No reminders yet</Text>
          </View>
        ) : (
          reminderList.map((reminderList, index) => (
            <View
              key={index}
              style={[
                styles.statCard,
                {
                  backgroundColor: theme.cardBackground,
                  alignItems: "flex-start",
                  marginBottom: 12,
                  opacity: reminderList.completed ? 0.6 : 1,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: theme.text,
                    textDecorationLine: reminderList.completed
                      ? "line-through"
                      : "none",
                    flex: 1,
                  }}
                >
                  {reminderList.title}
                </Text>

                <TouchableOpacity
                  onPress={() => handleDeleteReminder(index)}
                  style={{ marginLeft: 8 }}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
              {reminderList.time ? (
                <Text
                  style={{
                    fontSize: 13,
                    color: theme.text,
                    marginTop: 4,
                  }}
                >
                  ⏰ {reminderList.time}
                </Text>
              ) : null}

              {reminderList.date ? (
                <Text
                  style={{
                    fontSize: 13,
                    color: theme.text,
                    marginTop: 4,
                  }}
                >
                  📅 {reminderList.date}
                </Text>
              ) : null}
              {reminderList.notes ? (
                <Text style={{ fontSize: 13, color: "#999", marginTop: 4 }}>
                  {reminderList.notes}
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={() => handleCompleteReminder(index)}
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: reminderList.completed
                    ? "#D1FAE5"
                    : "#F3F4F6",
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                }}
              >
                <Ionicons
                  name={
                    reminderList.completed
                      ? "checkmark-circle"
                      : "checkmark-circle-outline"
                  }
                  size={18}
                  color={reminderList.completed ? "#10B981" : "#9CA3AF"}
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: reminderList.completed ? "#10b981" : theme.primary,
                  }}
                >
                  {reminderList.completed ? "Completed" : "Mark Complete"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
        {reminderList.length < 2 && (
          <TouchableOpacity
            style={[
              styles.createReminderButton,
              { marginBottom: 20, alignSelf: "center" },
            ]}
            onPress={() => setIsReminderModalVisible(true)}
          >
            <Text style={styles.createReminderButtonText}>+ Add Reminder</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Voice Modal */}
      <Modal visible={voiceModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.cardBackground, maxHeight: 320 },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: theme.text, marginBottom: 16 },
              ]}
            >
              Voice Reminder
            </Text>
            <Text
              style={{
                color: "#9333ea",
                fontSize: 14,
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              {isListening ? "Listening..." : "Tap Save or Cancel"}
            </Text>
            <View
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.inputBackground,
                  justifyContent: "center",
                  marginBottom: 20,
                  minHeight: 60,
                  height: "auto",
                },
              ]}
            >
              <Text style={{ color: theme.text, fontSize: 15 }}>
                {voiceTranscript || (isListening ? "..." : "Nothing heard yet")}
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  try {
                    ExpoSpeechRecognitionModule.stop();
                  } catch {}
                  setIsListening(false);
                  setVoiceTranscript("");
                  setVoiceModalVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveVoiceReminder}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reminder Modal */}
      <Modal
        visible={isReminderModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsReminderModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsReminderModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.cardBackground },
              ]}
            >
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Create Reminder
                </Text>
                <TouchableOpacity
                  onPress={() => setIsReminderModalVisible(false)}
                >
                  <Ionicons
                    name="close"
                    size={28}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {/* Reminder Form */}
              <ScrollView
                style={styles.modalForm}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.inputGroup}>
                  <Text style={[styles.statLabel, { color: theme.text }]}>
                    Reminder Title
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.inputBorder,
                        color: theme.text,
                      },
                    ]}
                    value={reminderTitle}
                    onChangeText={setReminderTitle}
                    placeholder="e.g., Send out emails"
                    placeholderTextColor={theme.textTertiary}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.statLabel, { color: theme.text }]}>
                    Time
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(!showTimePicker)}
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.inputBorder,
                        justifyContent: "center",
                      },
                    ]}
                  >
                    <Text style={{ color: theme.text, fontSize: 15 }}>
                      {reminderTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <View
                      style={{
                        backgroundColor: "#1f2937",
                        borderRadius: 10,
                        overflow: "hidden",
                        marginTop: 10,
                        marginBottom: 2,
                      }}
                    >
                      {Platform.OS === "web" ? (
                        <input
                          type="time"
                          style={{
                            width: "100%",
                            padding: "12px",
                            fontSize: "16px",
                            backgroundColor: "#1f2937",
                            color: "#ffffff",
                            border: "none",
                            outline: "none",
                            cursor: "pointer",
                          }}
                          defaultValue={reminderTime.toLocaleTimeString(
                            "en-GB",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                          onBlur={(e) => {
                            const val = e.target.value;
                            if (!val) return;
                            const [hours, minutes] = val.split(":");
                            const h = parseInt(hours);
                            const m = parseInt(minutes);
                            if (isNaN(h) || isNaN(m)) return;
                            const newTime = new Date();
                            newTime.setHours(h);
                            newTime.setMinutes(m);
                            newTime.setSeconds(0);
                            setReminderTime(newTime);
                          }}
                        />
                      ) : (
                        <DateTimePicker
                          value={reminderTime}
                          mode="time"
                          display="default"
                          style={{ height: 120 }}
                          textColor="#ffffff"
                          onChange={(event, selectedTime) => {
                            if (event.type === "set" && selectedTime) {
                              setReminderTime(selectedTime);
                            }
                            setShowTimePicker(false);
                          }}
                        />
                      )}
                      <TouchableOpacity
                        onPress={() => setShowTimePicker(false)}
                        style={{
                          backgroundColor: "#9333ea",
                          paddingVertical: 10,
                          borderRadius: 8,
                          alignItems: "center",
                          marginTop: 8,
                          marginHorizontal: 10,
                          marginBottom: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: "#FFF",
                            fontWeight: "600",
                            fontSize: 15,
                          }}
                        >
                          Confirm Time
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.statLabel, { color: theme.text }]}>
                    Date
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(!showDatePicker)}
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.inputBorder,
                        justifyContent: "center",
                      },
                    ]}
                  >
                    <Text style={{ color: theme.text, fontSize: 15 }}>
                      {reminderDate.toLocaleDateString([], {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <View
                      style={{
                        backgroundColor: "#1f2937",
                        borderRadius: 10,
                        overflow: "hidden",
                        marginTop: 10,
                        marginBottom: 2,
                      }}
                    >
                      {Platform.OS === "web" ? (
                        <input
                          type="time"
                          style={{
                            width: "100%",
                            padding: "12px",
                            fontSize: "16px",
                            backgroundColor: "#1f2937",
                            color: "#ffffff",
                            border: "none",
                            outline: "none",
                            cursor: "pointer",
                          }}
                          defaultValue={
                            reminderDate.toISOString().split("T")[0]
                          }
                          onBlur={(e) => {
                            const val = e.target.value;
                            if (!val) return;
                            setReminderDate(new Date(val));
                          }}
                        />
                      ) : (
                        <DateTimePicker
                          value={reminderDate}
                          mode="date"
                          display="default"
                          onChange={(event, selectedDate) => {
                            if (event.type === "set" && selectedDate) {
                              setReminderDate(selectedDate);
                            }
                            setShowDatePicker(false);
                          }}
                        />
                      )}
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                        style={{
                          backgroundColor: "#9333ea",
                          paddingVertical: 10,
                          borderRadius: 8,
                          alignItems: "center",
                          marginTop: 8,
                          marginHorizontal: 10,
                          marginBottom: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: "#FFF",
                            fontWeight: "600",
                            fontSize: 15,
                          }}
                        >
                          Confirm Date
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.statLabel, { color: theme.text }]}>
                    Notes (Optional)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.inputBorder,
                        color: theme.text,
                        height: 100,
                        paddingTop: 10,
                      },
                    ]}
                    value={reminderNotes}
                    onChangeText={setReminderNotes}
                    placeholder="Add any additonal notes..."
                    placeholderTextColor={theme.textTertiary}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
                <View style={{ height: 20 }} />
              </ScrollView>

              {/* Modal Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsReminderModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleCreateReminder}
                >
                  <Text style={styles.saveButtonText}>Create Reminder</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      {/* Bottom Navigation */}
      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: theme.cardBackground,
            borderTopColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/adultDashboard")}
        >
          <MaterialCommunityIcons
            name="chart-box-outline"
            size={28}
            color="#EF4444"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/progressjourney")}
        >
          <Ionicons name="checkmark-circle-outline" size={28} color="#F59E0B" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/adultfocustimer")}
        >
          <Ionicons name="timer-outline" size={28} color="#06B6D4" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/adultcalender")}
        >
          <Ionicons name="calendar-outline" size={28} color="#f50b9bd3" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/adultSettings")}
        >
          <Ionicons name="settings-outline" size={28} color="#06B6D4" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF4F5",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },

  dashboardTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#9333EA",
    marginBottom: 4,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  username: {
    fontSize: 13,
    color: "#666",
  },

  statsGrid: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 6,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  statCardLeft: {
    marginRight: 5,
  },
  statCardRight: {
    marginLeft: 5,
  },

  statNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: "#666",
    marginBottom: 4,
  },

  statNumberOrange: {
    color: "#F97316",
  },

  statNumberCyan: {
    color: "#06B6D4",
  },

  statNumberPurple: {
    color: "#9333EA",
  },

  statLabel: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 6,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 16,
    marginBottom: 20,
  },

  actionIcon: {
    padding: 8,
  },

  remindersHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  remindersHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9333EA",
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },

  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    marginBottom: 20,
  },

  createReminderButton: {
    backgroundColor: "#9333EA",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },

  createReminderButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContent: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "90%",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#E5E7EB",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
  },

  modalForm: {
    maxHeight: "70%",
  },

  inputGroup: {
    marginTop: 20,
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 15,
  },

  textArea: {
    height: 100,
    paddingTop: 20,
    textAlignVertical: "top",
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
  },

  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  cancelButton: {
    backgroundColor: "#E5E7EB",
  },

  cancelButtonText: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "600",
  },

  saveButton: {
    backgroundColor: "#9333EA",
  },

  saveButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
  },
  navItem: { padding: 8 },
});

export default AdultDashboard;
