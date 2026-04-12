import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const auth = require("@react-native-firebase/auth").default;
const firestore = require("@react-native-firebase/firestore").default;

const NAME_TAGS = [
  { id: "penguin", emoji: "🐧" },
  { id: "bunny", emoji: "🐰" },
  { id: "bear", emoji: "🐻" },
  { id: "cat", emoji: "🐱" },
];

export default function Register() {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Oops!", "Please enter your name");
    if (pin.length !== 5)
      return Alert.alert("Oops!", "Your PIN must be exactly 5 numbers");
    if (!email.trim())
      return Alert.alert("Oops!", "Please enter a parent's email");
    if (!selectedTag) return Alert.alert("Oops!", "Please pick a name tag.");

    setLoading(true);
    try {
      const kidEmail = `kid.${name.trim().toLowerCase().replace(/\s+/g, ".")}@remindme.app`;

      const firebasePin = pin + "0";
      const result = await auth().createUserWithEmailAndPassword(
        kidEmail,
        firebasePin,
      );

      await firestore().collection("kids").doc(result.user.uid).set({
        name: name.trim(),
        nametag: selectedTag,
        email: email.trim().toLowerCase(),
        points: 0,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      await AsyncStorage.setItem("kidEmail", kidEmail);
      await AsyncStorage.setItem("kidName", name.trim());

      Alert.alert("Account created!", `Welcome, ${name}! 🎉`);
      router.push("./kids-login");
    } catch (e: any) {
      console.log("Error:", e.code, e.message);
      if (e.code === "auth/email-already-in-use") {
        Alert.alert("Oops!", "An account with that name already exists.");
      } else {
        Alert.alert("Oops!", "Something went wrong. Please try again");
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
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.card}>
          {/* Name */}
          <Text style={styles.label}>Enter Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="---"
            placeholderTextColor="#aaa"
          />

          {/* PIN */}
          <Text style={styles.label}>Create 5 number pincode</Text>
          <TextInput
            style={styles.input}
            value={pin}
            onChangeText={setPin}
            placeholder="---"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            maxLength={5}
            secureTextEntry
          />

          {/* Email */}
          <Text style={styles.label}>Enter Parent/Supervisor{"\n"}Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="---"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Name Tag Selector */}
          <Text style={styles.label}>Select Name Tag</Text>
          <View style={styles.tagGrid}>
            {NAME_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.tagItem,
                  selectedTag === tag.id && styles.tagSelected,
                ]}
                onPress={() => setSelectedTag(tag.id)}
              >
                <Text style={styles.tagEmoji}>{tag.emoji}</Text>
                <View
                  style={[
                    styles.tagNameBox,
                    {
                      borderColor: selectedTag === tag.id ? "#5bbfb0" : "#ddd",
                    },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={[styles.saveText, loading && { opacity: 0.5 }]}>
            {loading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#5bbfb0",
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(230, 215, 215, 0.55)",
    borderRadius: 20,
    padding: 20,
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginTop: 10,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#333",
  },
  tagGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
    backgroundColor: "rgba(240,230,230,0.6)",
    borderRadius: 14,
    padding: 12,
    justifyContent: "center",
  },
  tagItem: {
    alignItems: "center",
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  tagSelected: {
    borderColor: "#5bbfb0",
    backgroundColor: "rgba(91,191,176,0.15)",
  },
  tagEmoji: {
    fontSize: 40,
  },
  tagNameBox: {
    width: 60,
    height: 18,
    borderWidth: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  saveText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#5bbfb0",
    textDecorationLine: "underline",
  },
});
