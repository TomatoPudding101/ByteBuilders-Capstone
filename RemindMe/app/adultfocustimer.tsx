import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "./ThemeContext";

const presets = [
  { label: "Focus", minutes: 30, color: "#9333ea" },
  { label: "Short Break", minutes: 5, color: "#10b981" },
  { label: "Long Break", minutes: 15, color: "#06b6d4" },
  { label: "Custom", minutes: 1, color: "#f97316" },
];

export default function FocusTimer() {
  const { isDarkMode, theme } = useTheme();
  const router = useRouter();

  const [selectedPreset, setSelectedPreset] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(presets[0].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSecondsLeft(presets[selectedPreset].minutes * 60);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [selectedPreset]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setSessions((s) => s + 1);
            Alert.alert(
              "Done!",
              `${presets}[selectedPreset].label} session complete!`,
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, selectedPreset]);

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(presets[selectedPreset].minutes * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const progress = secondsLeft / (presets[selectedPreset].minutes * 60);
  const activeColor = presets[selectedPreset].color;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <LinearGradient
        colors={
          isDarkMode
            ? ["#1F2937", "#1F2937"]
            : ["#FFF0F0", "#F0F4FF", "#F0FFF4"]
        }
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: activeColor }]}>
            Focus Timer
          </Text>
          <View style={styles.sessionsRow}>
            <Ionicons name="flame" size={16} color="#f97316" />
            <Text style={[styles.sessionsText, { color: theme.text }]}>
              {sessions} session{sessions !== 1 ? "s" : ""} today
            </Text>
          </View>
        </View>

        <View style={styles.timerContainer}>
          <View
            style={[
              styles.timerCircle,
              {
                borderColor: activeColor,
                backgroundColor: theme.cardBackground,
                borderWidth: 8 * progress + 2,
              },
            ]}
          >
            <Text style={[styles.timerText, { color: activeColor }]}>
              {formatTime(secondsLeft)}
            </Text>
            <Text style={[styles.timerLabel, { color: theme.text }]}>
              {presets[selectedPreset].label}
            </Text>
            <Text style={[styles.progressText, { color: theme.text }]}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              { backgroundColor: theme.cardBackground },
            ]}
            onPress={handleReset}
          >
            <Ionicons name="refresh" size={28} color={theme.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: activeColor }]}
            onPress={() => setIsRunning((r) => !r)}
          >
            <Ionicons
              name={isRunning ? "pause" : "play"}
              size={36}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              { backgroundColor: theme.cardBackground },
            ]}
            onPress={() => {
              setIsRunning(false);
              setSecondsLeft(0);
            }}
          >
            <Ionicons name="stop" size={28} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.presetRow}>
          {presets.map((preset, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedPreset(i)}
              style={[
                styles.presetButton,
                {
                  backgroundColor:
                    selectedPreset === i ? preset.color : theme.cardBackground,
                  borderColor: preset.color,
                },
              ]}
            >
              <Text
                style={[
                  styles.presetText,
                  { color: selectedPreset === i ? "#fff" : preset.color },
                ]}
              >
                {preset.label}
              </Text>
              <Text
                style={[
                  styles.presetMins,
                  { color: selectedPreset === i ? "#fff" : theme.text },
                ]}
              >
                {preset.minutes}m
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  header: {
    marginTop: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },
  sessionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sessionsText: {
    fontSize: 13,
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingBottom: 20,
    paddingHorizontal: 4,
    justifyContent: "center",
    marginTop: 60,
    marginBottom: 20,
  },
  presetButton: {
    borderRadius: 12,
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    width: "45%",
  },
  presetText: {
    fontSize: 13,
    fontWeight: "600",
  },
  presetMins: {
    fontSize: 11,
    marginTop: 2,
  },
  timerContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  timerText: {
    fontSize: 52,
    fontWeight: "700",
  },
  timerLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  progressText: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.6,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    paddingBottom: 20,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },

  navItem: {
    padding: 8,
  },
});
