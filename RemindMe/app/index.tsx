import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "./ThemeContext";

export default function SelectVersion() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <LinearGradient
        colors={
          isDarkMode
            ? ["#1f2937", "#1f2937"]
            : ["#fff0f0", "#f0f4ff", "#f0fff4"]
        }
        style={StyleSheet.absoluteFill}
      />

      <Text style={[styles.title, { color: theme.primary }]}>RemindME</Text>
      <Text style={[styles.question, { color: theme.text }]}>
        Which version of the app do you wish to use?
      </Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.cardBackground }]}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.emoji}>👨‍💼</Text>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Adult</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.cardBackground }]}
          onPress={() => router.push("/kids-login")}
        >
          <Text style={styles.emoji}>🧒</Text>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Kid</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 36, fontWeight: "700", marginBottom: 12 },
  question: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  row: { flexDirection: "row", gap: 16, paddingHorizontal: 20 },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  emoji: { fontSize: 48 },
  cardTitle: { fontSize: 22, fontWeight: "700" },
});
