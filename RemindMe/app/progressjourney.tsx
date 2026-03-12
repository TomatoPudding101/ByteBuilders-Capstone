import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "./ThemeContext";

export default function ProgressScreen() {
  const { isDarkMode, theme } = useTheme();
  const router = useRouter();

  const [progressStats, setProgressStats] = useState({
    completed: 0,
    streak: 0,
    activeDays: 0,
    missedDays: 0,
  });

  useEffect(() => {
    const loadStats = () => {
      AsyncStorage.getItem("progressStats").then((saved) => {
        if (saved) setProgressStats(JSON.parse(saved));
      });
    };

    loadStats();
    const interval = setInterval(loadStats, 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: "Current Streak",
      value: progressStats.streak,
      icon: "flame",
      color: "#F97316",
    },
    {
      label: "Best Streak",
      value: progressStats.streak,
      icon: "ribbon",
      color: "#F59E0B",
    },
    {
      label: "Total Tasks",
      value: progressStats.completed,
      icon: "radio-button-on",
      color: "#10B981",
    },
    {
      label: "Todays Rate",
      value:
        progressStats.completed === 0
          ? "0%"
          : progressStats.completed + " done",
      icon: "calendar",
      color: "#6366F1",
    },
    {
      label: "Missed Days",
      value: progressStats.missedDays,
      icon: "close-circle",
      color: "#EF4444",
    },
    {
      label: "Active Days",
      value: progressStats.activeDays,
      icon: "trending-up",
      color: "#8B5CF6",
    },
  ];

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

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            🔥 Your Progress Journey
          </Text>
        </View>

        <View style={styles.grid}>
          {stats.map((stat, i) => (
            <View
              key={i}
              style={[styles.card, { backgroundColor: theme.cardBackground }]}
            >
              <Ionicons name={stat.icon as any} size={28} color={stat.color} />
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textTertiary }]}>
                {stat.label}
              </Text>
            </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  title: { fontSize: 22, fontWeight: "700", flex: 1 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  card: {
    width: "47%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: { fontSize: 32, fontWeight: "700" },
  statLabel: { fontSize: 12, textAlign: "center" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    marginTop: "auto",
  },
  navItem: { padding: 8 },
});
