import { useRewards } from "./rewardContext";
import { useTheme } from "./ThemeContext";
import { useUser } from "./userContext";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AdultSettings = () => {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  const [activeTab, setActiveTab] = useState<
    "profile" | "parental controls" | "preferences" | "accessibility"
  >("profile");
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const { children: kids, addPoints } = useRewards();

  const { logout } = useUser();

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

      {/* Heading */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/adultDashboard")}
        >
          <Ionicons name="arrow-back" size={24} color="#9333EA" />
          <Text
            style={[
              styles.backText,
              { backgroundColor: theme.background, color: theme.text },
            ]}
          >
            Back to Dashboard
          </Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={[styles.settingsLabel, { color: theme.text }]}>
          settings
        </Text>
        <Text style={styles.pageTitle}>Account Settings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "profile" && styles.tabActive,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
          onPress={() => setActiveTab("profile")}
        >
          <Ionicons
            name="person-outline"
            size={18}
            color={activeTab === "profile" ? "#9333EA" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "profile" && styles.tabTextActive,
              { color: theme.text },
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "parental controls" && styles.tabActive,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
          onPress={() => setActiveTab("parental controls")}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={18}
            color={activeTab === "parental controls" ? "#9333EA" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "parental controls" && styles.tabTextActive,
              { color: theme.text },
            ]}
          >
            Parental Controls
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "preferences" && styles.tabActive,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
          onPress={() => setActiveTab("preferences")}
        >
          <Ionicons
            name="settings-outline"
            size={18}
            color={activeTab === "preferences" ? "#9333EA" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "preferences" && styles.tabTextActive,
              { color: theme.text },
            ]}
          >
            Preferences
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "accessibility" && styles.tabActive,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
          onPress={() => setActiveTab("accessibility")}
        >
          <MaterialCommunityIcons
            name="account-voice"
            size={18}
            color={activeTab === "accessibility" ? "#9333EA" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "accessibility" && styles.tabTextActive,
              { color: theme.text },
            ]}
          >
            Accessibility
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "profile" && (
          <>
            {/* Profile Information */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.inputBorder,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>
                  Profile Information
                </Text>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.cardSubtitle, { color: theme.text }]}>
                Update your personal details
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Full Name
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#95badf"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Email Address
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  placeholder="Enter your email address"
                  placeholderTextColor="#95badf"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Account Actions */}
            <View
              style={[styles.card, { backgroundColor: theme.cardBackground }]}
            >
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Account Actions
              </Text>

              <TouchableOpacity
                style={[
                  styles.signOutButton,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.inputBorder,
                  },
                ]}
                onPress={async () => {
                  await logout();
                  router.push("./login");
                }}
              >
                <Text style={[styles.signOutText, { color: theme.text }]}>
                  Sign Out
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {activeTab === "parental controls" && (
          <>
            <View
              style={[styles.card, { backgroundColor: theme.cardBackground }]}
            >
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Your children
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.text }]}>
                Manage your children and their tasks
              </Text>

              <Text style={[styles.cardSubtitle, { color: theme.text }]}>
                Coming soon...
              </Text>
            </View>

            <View
              style={[styles.card, { backgroundColor: theme.cardBackground }]}
            >
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Manage rewards
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.text }]}>
                Manage your child`s rewards and points
              </Text>

              {kids.map((kid) => (
                <View key={kid.id} style={rewardStyles.kidRow}>
                  <View style={rewardStyles.kidInfo}>
                    <Text style={[rewardStyles.kidName, { color: theme.text }]}>
                      {kid.name}
                    </Text>
                    <Text style={rewardStyles.kidPoints}>
                      ⭐ {kid.points} pts
                    </Text>
                  </View>
                  <View style={rewardStyles.btnRow}>
                    {[5, 10, 25, 50].map((amt) => (
                      <TouchableOpacity
                        key={amt}
                        style={rewardStyles.awardBtn}
                        onPress={() => addPoints(kid.id, amt)}
                      >
                        <Text style={rewardStyles.awardBtnText}>+{amt}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={rewardStyles.deduceBtn}
                      onPress={() => addPoints(kid.id, -10)}
                    >
                      <Text style={rewardStyles.deduceBtnText}>-10</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <Text style={[rewardStyles.tierTitle, { color: theme.text }]}>
                Reward Tiers
              </Text>
              {REWARDS.map((r) => (
                <View
                  key={r.id}
                  style={[rewardStyles.tierRow, { backgroundColor: r.color }]}
                >
                  <Text style={rewardStyles.tierIcon}>{r.icon}</Text>
                  <Text style={[rewardStyles.tierLabel, { color: r.dark }]}>
                    {r.label}
                  </Text>
                  <Text style={[rewardStyles.tierPts, { color: r.dark }]}>
                    {r.points} pts
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === "preferences" && (
          <>
            <View
              style={[styles.card, { backgroundColor: theme.cardBackground }]}
            >
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Notification Preferences
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.text }]}>
                Manage notification settings
              </Text>

              <Text style={[styles.cardSubtitle, { color: theme.text }]}>
                Coming soon...
              </Text>
            </View>

            <View
              style={[styles.card, { backgroundColor: theme.cardBackground }]}
            >
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                App Preferences
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.text }]}>
                Customize your app experience
              </Text>

              <Text style={[styles.cardSubtitle, { color: theme.text }]}>
                Coming soon...
              </Text>
            </View>
          </>
        )}

        {activeTab === "accessibility" && (
          <>
            <View
              style={[styles.card, { backgroundColor: theme.cardBackground }]}
            >
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Accessibility Options
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.text }]}>
                Customize accessibility features
              </Text>

              <Text style={[styles.cardSubtitle, { color: theme.text }]}>
                Coming soon...
              </Text>
            </View>

            <View
              style={[styles.card, { backgroundColor: theme.cardBackground }]}
            >
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Display Settings
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.text }]}>
                Adjust text size and contrast
              </Text>

              <View style={[styles.settingRow, { borderColor: theme.border }]}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    Dark Mode
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.textTertiary },
                    ]}
                  >
                    Enable dark theme
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    isDarkMode && styles.toggleButtonActive,
                  ]}
                  onPress={toggleDarkMode}
                >
                  <View
                    style={[
                      styles.toggleCircle,
                      isDarkMode && styles.toggleCircleActive,
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
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
        <TouchableOpacity style={styles.navItem}>
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  backText: {
    flex: 1,
    backgroundColor: "#FDF4F5",
  },

  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  settingsLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#9333EA",
  },

  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    gap: 6,
    marginBottom: 20,
  },

  tab: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#FFF",
  },

  tabActive: {
    backgroundColor: "#F3E8FF",
  },

  tabText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
  },

  tabTextActive: {
    color: "#9333EA",
    fontWeight: "600",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 13,
    color: "#9333EA",
    marginBottom: 20,
  },

  editButton: {
    backgroundColor: "#9333EA",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  editButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#333",
  },

  signOutButton: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#9333EA",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },

  signOutText: {
    color: "#9333EA",
    fontSize: 15,
    fontWeight: "600",
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

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    marginTop: 12,
  },

  settingInfo: {
    flex: 1,
  },

  settingDescription: {
    fontSize: 12,
    marginTop: 4,
  },

  toggleButton: {
    width: 51,
    height: 31,
    borderRadius: 16,
    backgroundColor: "#D1D5DB",
    padding: 2,
    justifyContent: "center",
  },

  toggleButtonActive: {
    backgroundColor: "#9333EA",
  },

  toggleCircle: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  toggleCircleActive: {
    transform: [{ translateX: 20 }],
  },
});

const rewardStyles = StyleSheet.create({
  kidRow: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 12,
  },
  kidInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  kidName: {
    fontSize: 16,
    fontWeight: "700",
  },

  kidPoints: {
    fontSize: 16,
    fontWeight: "700",
  },
  btnRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  awardBtn: {
    backgroundColor: "#9333ea",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  awardBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  deduceBtn: {
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  deduceBtnText: {
    color: "#dc2626",
    fontWeight: "700",
    fontSize: 13,
  },
  tierTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  tierRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 8,
    marginBottom: 6,
    gap: 8,
  },
  tierIcon: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
  },
  tierLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
  },
  tierPts: {
    fontSize: 12,
    fontWeight: "700",
  },
});

export default AdultSettings;
