import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ColorValue,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const BG_IMAGE = require("../assets/images/adult-bg.png");

export default function LoginScreen() {
  const [parentId, setParentId] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const handleSignIn = () => {
    console.log("Signing in with", parentId, password);
    router.push("/adultDashboard");
    // Example: navigation.replace?.('MainTabs');
  };

  const gradientColors: readonly [ColorValue, ColorValue, ColorValue] = darkMode
    ? ["#4b3bff", "#a22ee0", "#ff2f65"]
    : ["#2E21E5", "#8E1DD0", "#ED2E65"];

  const cardBg = darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";
  const inputBg = darkMode ? "#FFF" : "#1E1E1E";
  const inputColor = darkMode ? "#000" : "#FFF";
  const labelColor = darkMode ? "#757575" : "#CCC";
  const screenOverlay = darkMode ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.1)";

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <ImageBackground
        source={BG_IMAGE}
        style={[styles.bg, { backgroundColor: screenOverlay }]}
        resizeMode="cover"
      >
        {/* Moon/Sun toggle top right */}
        <TouchableOpacity
          style={styles.iconToggle}
          onPress={() => setDarkMode(!darkMode)}
          accessibilityRole="switch"
        >
          <Ionicons
            name={darkMode ? "moon" : "sunny"}
            size={28}
            color={darkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Brand */}
          <View style={styles.topContainer}>
            <Text
              style={[
                styles.brand,
                { color: darkMode ? "#FFD700" : "#FFB700 " },
              ]}
            >
              RemindME
            </Text>
            <Text style={[styles.subtitle, { color: labelColor }]}>
              Your accessible reminder companion
            </Text>
          </View>

          {/* Card */}
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Text style={[styles.welcome, { color: gradientColors[0] }]}>
              Welcome Back
            </Text>

            {/* Parent ID Input */}
            <Text style={styles.label}>Parent ID</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: inputBg, color: inputColor },
              ]}
              value={parentId}
              onChangeText={setParentId}
              placeholder="Enter your Parent ID"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="default"
              accessibilityLabel="Parent ID input"
            />

            {/* Password Input */}
            <Text style={[styles.label, { color: labelColor }]}>Password</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: inputBg, color: inputColor },
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry
              autoCapitalize="none"
            />

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleSignIn}
              activeOpacity={0.85}
              style={{ marginTop: 18 }}
            >
              <LinearGradient
                colors={gradientColors}
                start={[0, 0]}
                end={[1, 0]}
                style={styles.signInButton}
              >
                <Text style={styles.signInText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View
              style={[styles.divider, { backgroundColor: gradientColors[0] }]}
            />

            {/* Footer */}
            <Text style={[styles.footerText, { color: labelColor }]}>
              No Account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/create-account")}>
              <Text style={[styles.createAccount, { color: labelColor }]}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 40 : 64,
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 48,
  },
  topContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  brand: {
    color: "#FFB700",
    fontSize: 32,
    fontWeight: "400",
  },
  subtitle: {
    color: "#757575",
    fontSize: 16,
    lineHeight: 16,
    textAlign: "center",
    width: Math.min(272, width * 0.9),
    marginTop: 6,
  },
  iconToggle: {
    position: "absolute",
    top: Platform.OS === "android" ? 40 : 64,
    right: 16,
    zIndex: 10,
  },
  card: {
    width: "86%",
    maxWidth: 328,
    minHeight: 472,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "stretch",
    marginTop: 6,
  },
  welcome: {
    fontSize: 32,
    fontWeight: "400",
    marginBottom: 12,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 16,
    fontSize: 16,
  },
  signInButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  divider: {
    height: 1,
    marginTop: 18,
    marginBottom: 12,
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  createAccount: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
