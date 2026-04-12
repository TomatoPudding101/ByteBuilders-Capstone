import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRewards } from "./rewardContext";

const REWARDS = [
  {
    id: 1,
    label: "Unlock 2 profile characters",
    points: 5,
    color: "#c8a8e8",
    dark: "#7040b0",
    icon: "👤",
  },
  {
    id: 2,
    label: "Choose your background",
    points: 10,
    color: "#a8d8c8",
    dark: "#208060",
    icon: "🖼️",
  },
  {
    id: 3,
    label: "Special surprise!",
    points: 25,
    color: "#a8c8e8",
    dark: "#205090",
    icon: "🎁",
  },
  {
    id: 4,
    label: "15 min extra screen time",
    points: 50,
    color: "#f8d8a8",
    dark: "#905010",
    icon: "📱",
  },
  {
    id: 5,
    label: "Stay up 15 min later",
    points: 75,
    color: "#f8c8d0",
    dark: "#902040",
    icon: "🌙",
  },
  {
    id: 6,
    label: "Choose dinner tonight",
    points: 100,
    color: "#d0e8a8",
    dark: "#406010",
    icon: "🍽️",
  },
  {
    id: 7,
    label: "Small treat",
    points: 200,
    color: "#e8d0a8",
    dark: "#704010",
    icon: "🍬",
  },
  {
    id: 8,
    label: "Small toy",
    points: 300,
    color: "#d8a8e8",
    dark: "#602080",
    icon: "🧸",
  },
];

export default function KidsRewards() {
  const router = useRouter();
  const { getPoints } = useRewards();
  const totalPoints = getPoints("kid1");

  const handleRedeem = (reward: (typeof REWARDS)[0]) => {
    if (totalPoints < reward.points) {
      Alert.alert(
        "Not enough points!",
        `You need ${reward.points - totalPoints} more points to unlock this reward.`,
      );
    } else {
      Alert.alert(
        "Reward unlocked!",
        `Ask a parent to help you claim: ${reward.label}`,
      );
    }
  };

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
          <Text style={styles.headerTitle}>My Rewards</Text>
          <Text style={styles.headerSub}>Earn points, unlock rewards!</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Points Banner */}
        <View style={styles.pointsBanner}>
          <Text style={styles.pointsLabel}>My Points</Text>
          <Text style={styles.pointsValue}>{totalPoints}</Text>
          <Text style={styles.pointsHint}>
            Complete goals to earn more points!
          </Text>
        </View>

        {/* Rewards List */}
        <Text style={styles.sectionTitle}>Rewards Shop</Text>
        {REWARDS.map((reward) => {
          const unlocked = totalPoints >= reward.points;
          return (
            <View
              key={reward.id}
              style={[
                styles.rewardCard,
                { backgroundColor: reward.color, opacity: unlocked ? 1 : 0.7 },
              ]}
            >
              <View style={styles.rewardLeft}>
                <Text style={styles.rewardIcon}>{reward.icon}</Text>
                <View>
                  <Text style={[styles.rewardLabel, { color: reward.dark }]}>
                    {reward.label}
                  </Text>
                  <Text style={[styles.rewardPoints, { color: reward.dark }]}>
                    {reward.points} points
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.redeemBtn,
                  {
                    backgroundColor: unlocked
                      ? reward.dark
                      : "rgba(150,150,150,0.3)",
                  },
                ]}
                onPress={() => handleRedeem(reward)}
              >
                <Text
                  style={[
                    styles.redeemText,
                    { color: unlocked ? "#fff" : "#aaa" },
                  ]}
                >
                  {unlocked ? "Redeem" : `${reward.points - totalPoints} pts`}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Parent note */}
        <View style={styles.parentNote}>
          <Text style={styles.parentNoteText}>
            Rewards are parent-controlled. Ask a parent to help you redeem!
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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

  pointsBanner: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  pointsLabel: { fontSize: 14, color: "#888", fontWeight: "600" },
  pointsValue: { fontSize: 56, fontWeight: "bold", color: "#8b6fd4" },
  pointsHint: { fontSize: 12, color: "#aaa", marginTop: 4 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 12,
  },

  rewardCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rewardLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  rewardIcon: { fontSize: 28 },
  rewardLabel: {
    fontSize: 14,
    fontWeight: "700",
    flexWrap: "wrap",
    maxWidth: 160,
  },
  rewardPoints: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  redeemBtn: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  redeemText: { fontSize: 13, fontWeight: "700" },

  parentNote: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  parentNoteText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
  },
});
