import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MENU_ITEMS = [
  {
    label: "Goals & Habits\nTracker",
    icon: "🎯",
    color: "#9b6fd4",
    route: "/goals",
  },
  { label: "Calendar", icon: "📅", color: "#5588e0", route: "/kidscalendar" },
  { label: "My Progress", icon: "📈", color: "#3cc470", route: "/progress" },
  { label: "Rewards", icon: "🎖️", color: "#d4a020", route: "/rewards" },
  { label: "Focus Timer", icon: "⏱️", color: "#e040a0", route: "/kidstimer" },
  { label: "Settings", icon: "⚙️", color: "#6655cc", route: "/settings" },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#fde8d0", "#f8c8d4", "#d4c8f0", "#c8e0f0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Welcome Banner */}
      <View style={styles.bannerArea}>
        <Text style={styles.welcomeText}>🎉 W E L C O M E 🎉</Text>
        <Text style={styles.starsDecor}>⭐ 🌟 ✨ ⭐ 🌟</Text>
      </View>

      {/* Home Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.homeTitle}>Home</Text>
        <View style={styles.nameTag}>
          <Text style={styles.nameTagEmoji}>🐧</Text>
          <View style={styles.nameTagBox}>
            <Text style={styles.nameTagLabel}>Name</Text>
          </View>
        </View>
      </View>

      {/* Menu Grid */}
      <View style={styles.grid}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.tile, { backgroundColor: item.color }]}
            onPress={() => router.push(item.route as any)}
          >
            <Text style={styles.tileIcon}>{item.icon}</Text>
            <Text style={styles.tileLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  bannerArea: {
    alignItems: "center",
    paddingTop: 8,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    letterSpacing: 3,
  },
  starsDecor: {
    fontSize: 18,
    marginTop: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  homeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#222",
  },
  nameTag: {
    alignItems: "center",
  },
  nameTagEmoji: {
    fontSize: 32,
  },
  nameTagBox: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#5588e0",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginTop: -4,
  },
  nameTagLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  tile: {
    width: "47%",
    aspectRatio: 1,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  tileIcon: {
    fontSize: 36,
  },
  tileLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    lineHeight: 18,
  },
});
