import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "./ThemeContext";
import { useUser } from "./userContext";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const firestore = require("@react-native-firebase/firestore").default;

type Reminder = {
  id: string;
  title: string;
  time: string;
  date?: string;
  notes: string;
  completed: boolean;
};

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Calendar() {
  const { isDarkMode, theme } = useTheme();
  const router = useRouter();
  const { currentUserId } = useUser();

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    if (!currentUserId || currentUserId === "devuser") return;

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
          setReminders(loaded);
        });
      return unsubscribe;
    } catch {
      console.log("Firestore not available in this enviornment");
    }
  }, [currentUserId]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(1);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(1);
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const selectedDateString = new Date(
    currentYear,
    currentMonth,
    selectedDate,
  ).toDateString();

  const selectedReminders = reminders.filter(
    (r) => r.date === selectedDateString,
  );

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top", "left", "bottom"]}
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

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: "#9333ea " }]}>📅 Calendar</Text>
        </View>

        <View
          style={[styles.monthNav, { backgroundColor: theme.cardBackground }]}
        >
          <TouchableOpacity onPress={goToPrevMonth} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={24} color="#9333ea" />
          </TouchableOpacity>
          <Text style={[styles.monthTitle, { color: theme.text }]}>
            {months[currentMonth]} {currentYear}
          </Text>
          <TouchableOpacity onPress={goToNextMonth} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={24} color="#9333ea" />
          </TouchableOpacity>
        </View>

        <View style={styles.dayLabels}>
          {days.map((d) => (
            <Text key={d} style={[styles.dayLabelText, { color: theme.text }]}>
              {d}
            </Text>
          ))}
        </View>

        <View
          style={[
            styles.calendarGrid,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          {calendarDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                day === selectedDate && styles.selectedDay,
                isToday(day!) && day !== selectedDate && styles.todayDay,
                !day && styles.emptyCell,
              ]}
              onPress={() => day && setSelectedDate(day)}
              disabled={!day}
            >
              {day && (
                <Text
                  style={[
                    styles.dayText,
                    { color: theme.text },
                    day === selectedDate && styles.selectedDayText,
                    isToday(day) && day !== selectedDate && styles.todayDayText,
                  ]}
                >
                  {day}
                </Text>
              )}
              {!!day &&
                reminders.some(
                  (r) =>
                    r.date ===
                    new Date(currentYear, currentMonth, day).toDateString(),
                ) && <View style={styles.dot} />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.remindersSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {months[currentMonth]} {selectedDate} - Reminders
          </Text>

          {selectedReminders.length === 0 ? (
            <View
              style={[
                styles.emptyState,
                { backgroundColor: theme.cardBackground },
              ]}
            >
              <Ionicons name="calendar-outline" size={40} color="#d1d5db" />
              <Text style={[styles.emptyText, { color: theme.text }]}>
                No reminders for this day
              </Text>
            </View>
          ) : (
            selectedReminders.map((reminder) => (
              <View
                key={reminder.id}
                style={[
                  styles.reminderCard,
                  {
                    backgroundColor: theme.cardBackground,
                    opacity: reminder.completed ? 0.6 : 1,
                  },
                ]}
              >
                <View style={styles.reminderLeft}>
                  <Ionicons
                    name={
                      reminder.completed
                        ? "checkmark-circle"
                        : "checkmark-circle-outline"
                    }
                    size={20}
                    color={reminder.completed ? "#10b981" : "#9333ea"}
                  />
                </View>
                <View style={styles.reminderInfo}>
                  <Text
                    style={[
                      styles.reminderTitle,
                      { color: theme.text },
                      reminder.completed && styles.completedText,
                    ]}
                  >
                    {reminder.title}
                  </Text>
                  {reminder.time ? (
                    <Text style={styles.reminderTime}>⏰ {reminder.time}</Text>
                  ) : null}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

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
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
  header: {
    marginTop: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  navBtn: {
    padding: 4,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  dayLabels: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  dayLabelText: {
    width: "14.28%",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.5,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 16,
    padding: 8,
    marginBottom: 20,
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  emptyCell: {
    opacity: 0,
  },
  selectedDay: {
    backgroundColor: "#9333ea",
  },
  todayDay: {
    borderWidth: 2,
    borderColor: "#9333ea",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "700",
  },
  todayDayText: {
    color: "#9333ea",
    fontWeight: "700",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#9333ea",
    marginTop: 2,
  },
  remindersSection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    borderRadius: 16,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.6,
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  reminderLeft: {
    width: 28,
    alignItems: "center",
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  reminderTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
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
