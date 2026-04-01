import {
  LexendExa_400Regular,
  LexendExa_600SemiBold,
  useFonts,
} from "@expo-google-fonts/lexend-exa";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TimerScreen() {
  const navigation = useNavigation();

  const [task, setTask] = useState("");
  const [time, setTime] = useState(15 * 60);
  const [running, setRunning] = useState(false);

  const presetRows = [
    [5, 10, 20],
    [30, 40, 60],
  ];

  const [fontsLoaded] = useFonts({
    LexendExa_400Regular,
    LexendExa_600SemiBold,
  });

  useEffect(() => {
    let interval: number;

    if (running && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running, time]); 

  if (!fontsLoaded) return null;

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      {/* Task Name */}
      <TextInput
        placeholder="ENTER TASK NAME"
        placeholderTextColor="#444"
        value={task}
        onChangeText={setTask}
        style={styles.input}
        multiline={true}
        numberOfLines={2}
      />

      {/* Timer Circle */}
      <View style={styles.circle}>
        <Text style={styles.timeText}>{formatTime()}</Text>
        <Text style={styles.subText}>
          {running ? "RUNNING!" : "READY TO START"}
        </Text>
      </View>

      {/* Start Button */}
      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => setRunning(!running)}
      >
        <Text style={styles.startText}>
          {running ? "PAUSE" : "START"}
        </Text>
      </TouchableOpacity>

      {/* Presets */}
      <View style={styles.presetsContainer}>
        {presetRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((p) => (
              <TouchableOpacity
                key={p}
                style={styles.preset}
                onPress={() => {
                  setTime(p * 60);
                  setRunning(false);
                }}
              >
                <Text style={styles.presetText}>{p}</Text>
                <Text style={styles.minText}>min</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E0E9",
    alignItems: "center",
    paddingTop: 60,
  },

  backBtn: {
    position: "absolute",
    top: 20,
    left: 20,
  },

  backText: {
    fontSize: 28,
    fontFamily: "LexendExa_600SemiBold",
  },

  input: {
    marginTop: 20,
    fontSize: 18,
    letterSpacing: 2,
    fontFamily: "LexendExa_400Regular",
    marginBottom: 40,
  
    width: "80%",
    textAlign: "center",
  
    maxHeight: 80,     
  },

  circle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 18,
    borderColor: "#D9C4CD",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEFCFD",
  },

  timeText: {
    fontSize: 48,
    fontFamily: "LexendExa_600SemiBold",
  },

  subText: {
    marginTop: 8,
    fontSize: 12,
    letterSpacing: 1,
    fontFamily: "LexendExa_400Regular",
  },

  startBtn: {
    marginTop: 30,
    backgroundColor: "#CBBFC7",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },

  startText: {
    fontSize: 18,
    fontFamily: "LexendExa_600SemiBold",
  },

  presetsContainer: {
    marginTop: 40,
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "110%",
    marginBottom: 40,
  },

  preset: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },

  presetText: {
    fontSize: 18,
    fontFamily: "LexendExa_600SemiBold",
  },

  minText: {
    fontSize: 10,
    fontFamily: "LexendExa_400Regular",
  },
});
