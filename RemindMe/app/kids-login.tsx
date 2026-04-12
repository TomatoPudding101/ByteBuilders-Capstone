import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const auth = require("@react-native-firebase/auth").default;

const PIN_LENGTH = 5;

const KEY_COLORS: Record<string, string> = {
  "1": "#e8706a",
  "2": "#5bbfb0",
  "3": "#6ab8d4",
  "4": "#7dc9b8",
  "5": "#d4c040",
  "6": "#d4a0c8",
  "7": "#88b0d8",
  "8": "#6040c0",
  "9": "#40d4c8",
  "0": "#e080a8",
  "⌫": "#a09090",
  "✓": "#909090",
};

export default function KidsLogin() {
  const [pin, setPin] = useState<string[]>([]);
  const [kidEmail, setKidEmail] = useState<string | null>(null);
  const [kidName, setKidName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadSavedKid = async () => {
      const savedEmail = await AsyncStorage.getItem("kidEmail");
      const savedName = await AsyncStorage.getItem("kidName");
      setKidEmail(savedEmail);
      setKidName(savedName);
    };
    loadSavedKid();
  }, []);

  const handleKey = (key: string) => {
    if (key === "⌫") {
      setPin((prev) => prev.slice(0, -1));
    } else if (key === "✓") {
      // confirm / submit
    } else if (pin.length < PIN_LENGTH) {
      setPin((prev) => [...prev, key]);
    }
  };

  const handleLetsGo = async () => {
    if (pin.length !== PIN_LENGTH)
      return Alert.alert("Enter your full 5-digit PIN");

    setLoading(true);
    try {
      const pinString = pin.join("") + "0";
      await auth().signInWithEmailAndPassword(kidEmail, pinString);
      router.push("./kidshome");
    } catch (e: any) {
      console.log("Kids login error:", e.code);
      if (
        e.code === "auth/wrong-password" ||
        e.code === "auth/invalid-credential"
      ) {
        Alert.alert("Wrong PIN!", "Try again.");
        setPin([]);
      } else {
        Alert.alert("Oops!", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#fde8d0", "#f8c8d4", "#d4c8f0", "#c8e0f0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {kidName && (
        <Text style={styles.welcomeText}> Welcome back, {kidName}! </Text>
      )}
      {/* PIN Display Box */}
      <View style={styles.pinBox}>
        <Text style={styles.pinTitle}>Enter Your Pin</Text>
        <View style={styles.pinDots}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, pin[i] ? styles.dotFilled : styles.dotEmpty]}
            />
          ))}
        </View>
      </View>

      {/* Number Pad */}
      <View style={styles.keypad}>
        {[
          ["1", "2", "3"],
          ["4", "5", "6"],
          ["7", "8", "9"],
          ["⌫", "0", "✓"],
        ].map((row, r) => (
          <View key={r} style={styles.keyRow}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={[styles.key, { backgroundColor: KEY_COLORS[key] }]}
                onPress={() => handleKey(key)}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Let's Go Button */}
      <TouchableOpacity
        style={[styles.letsGoButton, loading && { opacity: 0.6 }]}
        onPress={handleLetsGo}
        disabled={loading}
      >
        <Text style={styles.letsGoText}>
          {loading ? "Checking..." : "Let`s Go!"}
        </Text>
      </TouchableOpacity>

      {/* Forgot Password / New User */}
      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => router.push("./kidsforgot-password")}
      >
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.newUserButton}
        onPress={() => router.push("./kidsregister")}
      >
        <Text style={styles.linkText}>New User?</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 20,
  },
  pinBox: {
    width: "100%",
    backgroundColor: "#6a9fd8",
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: "center",
    gap: 16,
  },
  pinTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  pinDots: {
    flexDirection: "row",
    gap: 12,
  },
  dot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
  },
  dotEmpty: {
    borderColor: "#fff",
    backgroundColor: "transparent",
  },
  dotFilled: {
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#555",
  },
  keypad: {
    gap: 12,
    alignItems: "center",
  },
  keyRow: {
    flexDirection: "row",
    gap: 16,
  },
  key: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "600",
  },
  letsGoButton: {
    width: "100%",
    backgroundColor: "#5cd65c",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3ab83a",
  },
  letsGoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  forgotButton: {
    backgroundColor: "rgba(200,200,200,0.5)",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  newUserButton: {
    backgroundColor: "rgba(180,150,200,0.4)",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: "#555",
    textDecorationLine: "underline",
    fontWeight: "600",
  },

  orText: {
    fontSize: 13,
    color: "#777",
  },
});
