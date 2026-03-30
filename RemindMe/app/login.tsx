import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
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
  View
} from "react-native";
import { useTheme } from "./ThemeContext";


const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [faceIDSupported, setFaceIDSupported] = useState(false);
  const [parentId, setParentId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { isDarkMode: darkMode, theme } = useTheme();

  const handleSignIn = async () => {
    console.log("Signing in with", parentId, password);

    // Save credentials securely
    await SecureStore.setItemAsync("userLoggedIn", "true");

    router.replace("/adultDashboard");
    // Example: navigation.replace?.('MainTabs');
  };

  const handleFaceIDLogin = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !enrolled) {
      alert("Face ID not available or not set up on this device.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Log in with Face ID",
      fallbackLabel: "Use Password",
    });

    if (result.success) {
      console.log("Face ID authentication successful");
      router.replace("/adultDashboard");
    }
  };

  useEffect(() => {
    const checkFaceID = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setFaceIDSupported(compatible && enrolled);

      const storedUser = await SecureStore.getItemAsync("userLoggedIn");

      if (compatible && enrolled && storedUser === "true") {
        setFaceIDSupported(true);
      }
    };

    checkFaceID();
  }, []);

  useEffect(() => {
    if (faceIDSupported) {
      handleFaceIDLogin();
    }
  }, [faceIDSupported]);

  const gradientColors: readonly [ColorValue, ColorValue, ColorValue] = darkMode
    ? ["#4b3bff", "#a22ee0", "#ff2f65"]
    : ["#2E21E5", "#8E1DD0", "#ED2E65"];

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

      <LinearGradient
        colors={
          darkMode ? ["#1f2937", "#1f2937"] : ["#fff0f0", "#f0f4ff", "#f0fff4"]
        }
        style={StyleSheet.absoluteFill}
      />

      <ImageBackground
        style={[styles.bg, { backgroundColor: theme.background }]}
        resizeMode="cover"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/")}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Brand */}
          <View style={styles.topContainer}>
            <Text style={[styles.brand, { color: theme.primary }]}>
              RemindME
            </Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>
              Your accessible reminder companion
            </Text>
          </View>

          {/* Card */}
          <View
            style={[styles.card, { backgroundColor: theme.cardBackground }]}
          >
            <Text style={[styles.welcome, { color: theme.text }]}>
              Welcome Back
            </Text>

            {/* Parent ID Input */}
            <Text style={[styles.label, { color: theme.text }]}>Parent ID</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  color: theme.text,
                  borderColor: theme.inputBorder,
                },
              ]}
              value={parentId}
              onChangeText={setParentId}
              placeholder="Enter your Parent ID"
              placeholderTextColor={darkMode ? "#95badf" : "#999"}
              autoCapitalize="none"
              keyboardType="default"
              accessibilityLabel="Parent ID input"
            />

            {/* Password Input */}
            <Text style={[styles.label, { color: theme.text }]}>Password</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  color: theme.text,
                  borderColor: theme.inputBorder,
                },
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={darkMode ? "#95badf" : "#999"}
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

            {/* Face ID Button */}
            {faceIDSupported && (
              <TouchableOpacity
                onPress={handleFaceIDLogin}
                style={styles.faceIDButton}
              >
                <Ionicons name="scan-outline" size={28} color={theme.primary} />
                <Text style={[styles.faceIDText, { color: theme.text}]}>
                  Sign in with Face ID
                </Text>
              </TouchableOpacity>
            )}

            {/* Divider */}
            <View
              style={[styles.divider, { backgroundColor: gradientColors[0] }]}
            />

            {/* Footer */}
            <Text style={[styles.footerText, { color: theme.text }]}>
              No Account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/create-account")}>
              <Text style={[styles.createAccount, { color: theme.text }]}>
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
    flexGrow: 1,
    justifyContent: "center",
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
  faceIDButton: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  faceIDText: {
    fontSize: 14,
    fontWeight: "600",
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
  backButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 40 : 64,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
});
