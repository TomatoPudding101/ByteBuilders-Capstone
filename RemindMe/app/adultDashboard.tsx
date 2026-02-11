import { useTheme } from "./ThemeContext";

import { useState } from "react";
import {
  Keyboard,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const AdultDashboard = () => {
  const router = useRouter();
  const { isDarkMode, theme } = useTheme();

  const [isReminderModalVisible, setIsReminderModalVisible] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [reminderNotes, setReminderNotes] = useState("");

  const handleCreateReminder = () => {
    console.log("Reminder created:", {
      reminderTitle,
      reminderTime,
      reminderNotes,
    });

    setReminderTitle("");
    setReminderTime("");
    setReminderNotes("");
    setIsReminderModalVisible(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dashboardTitle}>Dashboard</Text>
          <View style={styles.userInfo}>
            <Ionicons name="person-circle-outline" size={16} color="#666" />
            <Text style={styles.username}>TestUser</Text>
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
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Total Reminders</Text>
        </View>
        <View
          style={[
            styles.statCard,
            styles.statCardRight,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <Text style={[styles.statNumber, styles.statNumberOrange]}>0</Text>
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
          <Text style={[styles.statNumber, styles.statNumberCyan]}>0</Text>
          <Text style={styles.statLabel}>Completed Today</Text>
        </View>
        <View
          style={[
            styles.statCard,
            styles.statCardRight,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <Text style={[styles.statNumber, styles.statNumberPurple]}>0%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>

      {/* Action Icons Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionIcon}>
          <Ionicons name="mic-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIcon}>
          <Ionicons name="notifications-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Your Reminders Section */}
      <TouchableOpacity style={styles.remindersHeader}>
        <Ionicons name="calendar-outline" size={20} color="#9333EA" />
        <Text style={styles.remindersHeaderText}>Your Reminders</Text>
      </TouchableOpacity>

      {/* Empty State} */}
      <View style={styles.emptyState}>
        <Ionicons name="calendar-outline" size={60} color="#D1D5DB" />
        <Text style={styles.emptyStateText}>No reminders yet</Text>
        <TouchableOpacity
          style={styles.createReminderButton}
          onPress={() => setIsReminderModalVisible(true)}
        >
          <Text style={styles.createReminderButtonText}>
            + Add Your First Reminder
          </Text>
        </TouchableOpacity>
      </View>

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
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.inputBorder,
                        color: theme.text,
                      },
                    ]}
                    value={reminderTime}
                    onChangeText={setReminderTime}
                    placeholder="e.g., 12:00 AM"
                    placeholderTextColor={theme.textTertiary}
                  />
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
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons
            name="chart-box-outline"
            size={28}
            color="#EF4444"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
    maxHeight: "70%",
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
    marginBottom: 12,
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
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
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
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },

  navItem: {
    padding: 8,
  },
});

export default AdultDashboard;
