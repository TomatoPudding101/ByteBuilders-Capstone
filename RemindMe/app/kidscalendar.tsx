import {
  Lexend_400Regular,
  Lexend_700Bold,
  useFonts,
} from "@expo-google-fonts/lexend";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type MonthTheme = {
  name: string;
  bg: string;
  text: string;
  accent: string;
};

type EventMap = { [key: string]: string[] };
type DateType = Date | null;

const monthThemes: Record<number, MonthTheme> = {
  0: { name: "January", bg: "#D6E6F2", text: "#2E4057", accent: "#7FB3D5" },
  1: { name: "February", bg: "#FADADD", text: "#6D2E46", accent: "#F1948A" },
  2: { name: "March", bg: "#D5F5E3", text: "#1E8449", accent: "#58D68D" },
  3: { name: "April", bg: "#E7CCD3", text: "#383F43", accent: "#EB9FBA" },
  4: { name: "May", bg: "#FCF3CF", text: "#7D6608", accent: "#F7DC6F" },
  5: { name: "June", bg: "#D6EAF8", text: "#1B4F72", accent: "#5DADE2" },
  6: { name: "July", bg: "#FDEBD0", text: "#7E5109", accent: "#F5B041" },
  7: { name: "August", bg: "#E8DAEF", text: "#512E5F", accent: "#BB8FCE" },
  8: { name: "September", bg: "#D4EFDF", text: "#145A32", accent: "#52BE80" },
  9: { name: "October", bg: "#FAD7A0", text: "#6E2C00", accent: "#EB984E" },
  10: { name: "November", bg: "#EAEDED", text: "#424949", accent: "#A6ACAF" },
  11: { name: "December", bg: "#D6EAF8", text: "#154360", accent: "#85C1E9" },
};

const getDaysInMonth = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  let days: Date[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null!);
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }
  return days;
};

export default function CalendarScreen() {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<DateType>(new Date());
  const [events, setEvents] = useState<EventMap>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState<string>("");

  if (!fontsLoaded) return null;

  const theme = monthThemes[currentDate.getMonth()];
  const days = getDaysInMonth(currentDate);

  const screenWidth = Dimensions.get("window").width;
  const BOX_SIZE = screenWidth / 7;

  const changeMonth = (dir: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + dir);
    setCurrentDate(newDate);
  };

// going back to the current date regardless of space
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const addEvent = () => {
    if (!selectedDate || !newEvent) return;

    const key = selectedDate.toDateString();
    setEvents((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), newEvent],
    }));

    setNewEvent("");
    setModalVisible(false);
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const renderDay = (date: Date | null) => {
    if (!date) return <View style={[styles.dayBox, { opacity: 0 }]} />;

    const key = date.toDateString();
    const hasEvent = events[key]?.length;

    const isSelected = selectedDate?.toDateString() === date.toDateString();
    const isToday = date.toDateString() === new Date().toDateString();

    return (
      <TouchableOpacity
        style={[
          styles.dayBox,
          {
            width: BOX_SIZE,
            height: BOX_SIZE,
            backgroundColor: isSelected
              ? theme.accent
              : "rgba(255,255,255,0.9)",
            borderWidth: isToday ? 3 : 0,
            borderColor: theme.accent,
            transform: [{ scale: isSelected ? 1.1 : 1 }],
          },
        ]}
        onPress={() => setSelectedDate(date)}
      >
        <Text
          style={{
            fontFamily: "Lexend_700Bold",
            fontSize: 18,
            color: isSelected ? "#fff" : theme.text,
          }}
        >
          {date.getDate()}
        </Text>

        {hasEvent && (
          <View
            style={{
              marginTop: 4,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 6,
              backgroundColor: theme.accent,
            }}
          >
            <Text style={{ fontSize: 10, color: "white" }}>•</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.background, { backgroundColor: theme.bg }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Text style={[styles.nav, { color: theme.text }]}>◀</Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={[styles.monthText, { color: theme.accent }]}>
            {theme.name.toUpperCase()}
          </Text>
          <Text style={[styles.yearText, { color: theme.text }]}>
            {currentDate.getFullYear()}
          </Text>
        </View>

        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Text style={[styles.nav, { color: theme.text }]}>▶</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.daysRow}>
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
          <Text
            key={d}
            style={[styles.dayHeader, { width: BOX_SIZE, color: theme.text }]}
          >
            {d}
          </Text>
        ))}
      </View>

      <FlatList
        data={days}
        numColumns={7}
        renderItem={({ item }) => renderDay(item)}
        keyExtractor={(item, index) => index.toString()}
      />

      <TouchableOpacity
        style={[styles.todayBtn, { backgroundColor: theme.accent }]}
        onPress={goToToday}
      >
        <Text style={styles.todayText}>Go to Today</Text>
      </TouchableOpacity>

      <View style={styles.dailyContainer}>
        {selectedDate && (
          <>
            <Text style={[styles.dailyTitle, { color: theme.accent }]}>
              {formatFullDate(selectedDate)}
            </Text>

            {(events[selectedDate.toDateString()] || []).length === 0 ? (
              <Text style={styles.noEvents}>No events today</Text>
            ) : (
              (events[selectedDate.toDateString()] || []).map(
                (event, index) => (
                  <Text key={index} style={styles.dailyEvent}>
                    º {event}
                  </Text>
                )
              )
            )}

            <TouchableOpacity
              style={[styles.quickAddBtn, { backgroundColor: theme.accent }]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ color: "white", fontFamily: "Lexend_700Bold" }}>
                + Add Reminder
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedDate?.toDateString()}
            </Text>

            <TextInput
              placeholder="Add the reminder"
              value={newEvent}
              onChangeText={setNewEvent}
              style={styles.input}
              placeholderTextColor="#888"
            />

            <TouchableOpacity style={styles.addBtn} onPress={addEvent}>
              <Text style={{ color: "white", fontFamily: "Lexend_700Bold" }}>
                Add Reminder
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// styles and design 
const styles = StyleSheet.create({
background: { flex: 1, paddingTop: 40, },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 10,},

  nav: { fontSize: 26, fontFamily: "Lexend_700Bold", },

  monthText: { fontSize: 32, fontFamily: "Lexend_700Bold", },

  yearText: { fontSize: 14, fontFamily: "Lexend_400Regular", opacity: 0.7, },

  daysRow: { flexDirection: "row", paddingHorizontal: 10, marginBottom: 5, },

  dayHeader: { textAlign: "center", fontFamily: "Lexend_700Bold", fontSize: 12, },

  dayBox: { aspectRatio: 1, justifyContent: "center", alignItems: "center", },

  todayBtn: { marginHorizontal: 150, marginTop: 10, paddingVertical: 10, borderRadius: 12, alignItems: "center", },

  todayText: { color: "white", fontFamily: "Lexend_700Bold", fontSize: 16, },

  dailyContainer: { marginTop: 10, marginHorizontal: 16, padding: 16, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.95)", },

  dailyTitle: {fontSize: 20, fontFamily: "Lexend_700Bold", marginBottom: 10, },

  dailyEvent: { fontSize: 16, marginVertical: 4, fontFamily: "Lexend_400Regular", },

  noEvents: { fontSize: 14, opacity: 0.6, fontFamily: "Lexend_400Regular",},

  quickAddBtn: { marginTop: 12, padding: 10, borderRadius: 10, alignItems: "center", },

  modal: { flex: 1, backgroundColor: "#00000088", justifyContent: "center", },

  modalContent: { backgroundColor: "white", margin: 20, padding: 20, borderRadius: 12, },

  modalTitle: { fontSize: 18, fontFamily: "Lexend_700Bold", },

  input: { borderWidth: 1, borderColor: "#ccc", marginVertical: 10, padding: 10, borderRadius: 8, fontFamily: "Lexend_400Regular", },

  addBtn: { backgroundColor: "#14452F", padding: 12, alignItems: "center", borderRadius: 8, },

  closeText: { color: "red", marginTop: 10, textAlign: "center", fontFamily: "Lexend_700Bold",},
  
  backText: {fontSize: 20, color: '#555' },
  
  backBtn: { backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', },
});
