import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
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
  { id: "bunny", label: "Bunny" },
  { id: "bear", label: "Bear" },
  { id: "cat", label: "Cat" },
  { id: "penguin", label: "Penguin" },
];

const CHARACTER_CROP: Record<string, { marginLeft: number; marginTop: number }> = {
  bunny:   { marginLeft: 0,    marginTop: 0 },
  bear:    { marginLeft: -110, marginTop: 0 },
  cat:     { marginLeft: 0,    marginTop: -110 },
  penguin: { marginLeft: -110, marginTop: -110 },
};

export default function Register() {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Oops!", "Please enter your name");
    if (pin.length !== 5)
      return Alert.alert("Oops!", "Your PIN must be exactly 5 numbers");
    if (!selectedTag) return Alert.alert("Oops!", "Please pick a character.");

    setLoading(true);
    try {
      // Save name and character locally so dashboard updates immediately
      await AsyncStorage.setItem("kidName", name.trim());
      await AsyncStorage.setItem("kidCharacter", selectedTag);

      // Try Firebase — skip gracefully if unavailable
      try {
        const kidEmail = `kid${Date.now()}@remindme.app`;
        const firebasePin = pin + "0";
        const result = await auth().createUserWithEmailAndPassword(kidEmail, firebasePin);
        await firestore().collection("kids").doc(result.user.uid).set({
          name: name.trim(),
          nametag: selectedTag,
          points: 0,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
        await AsyncStorage.setItem("kidEmail", kidEmail);
      } catch (firebaseErr) {
        console.log("Firebase unavailable, saving locally only:", firebaseErr);
      }

      Alert.alert("Saved!", `Welcome, ${name}! 🎉`);
      router.push("./kidshome");
    } catch (e: any) {
      Alert.alert("Oops!", "Something went wrong. Please try again");
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
          <Text style={styles.label}>Enter Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="---"
            placeholderTextColor="#aaa"
          />

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

          <Text style={styles.label}>Select Your Character</Text>
          <Text style={styles.sublabel}>Tap a character to choose your name tag!</Text>

          <View style={styles.charGrid}>
            {NAME_TAGS.map((tag) => {
              const crop = CHARACTER_CROP[tag.id];
              return (
                <TouchableOpacity
                  key={tag.id}
                  style={[
                    styles.charTile,
                    selectedTag === tag.id && styles.charTileSelected,
                  ]}
                  onPress={() => setSelectedTag(tag.id)}
                >
                  <View style={styles.imageClip}>
                    <Image
                      source={require("../assets/images/animalschar.png")}
                      style={[styles.charImage, { marginLeft: crop.marginLeft, marginTop: crop.marginTop }]}
                    />
                  </View>
                  <Text style={[
                    styles.charLabel,
                    selectedTag === tag.id && styles.charLabelSelected,
                  ]}>
                    {tag.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={loading}
        >
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
  sublabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#333",
  },
  charGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginTop: 8,
  },
  charTile: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: "transparent",
    padding: 6,
    backgroundColor: "rgba(255,255,255,0.5)",
    gap: 4,
  },
  charTileSelected: {
    borderColor: "#5bbfb0",
    backgroundColor: "rgba(91,191,176,0.15)",
  },
  imageClip: {
    width: 100,
    height: 100,
    overflow: "hidden",
    borderRadius: 10,
  },
  charImage: {
    width: 220,
    height: 220,
  },
  charLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
  },
  charLabelSelected: {
    color: "#5bbfb0",
    fontWeight: "700",
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  saveText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#5bbfb0",
    textDecorationLine: "underline",
  },
});