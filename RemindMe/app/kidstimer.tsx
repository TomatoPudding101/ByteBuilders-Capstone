import {
  LexendExa_400Regular,
  LexendExa_600SemiBold,
  useFonts,
} from "@expo-google-fonts/lexend-exa";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TimerScreen() {
  const router = useRouter();
  const {task: routeTask} = useLocalSearchParams();

  const [task, setTask] = useState(routeTask ? String(routeTask): "");
  const [time, setTime] = useState(15 * 60);
  const [running, setRunning] = useState(false);

  // will create a custom timer feature in the future 
    // for now, this is the set timers
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
    <LinearGradient
    colors={['#fde8d0', '#f8c8d4', '#d4c8f0', '#c8e0f0']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{flex: 1}}
  >
    <ScrollView showsVerticalScrollIndicator={false} 
    contentContainerStyle={styles.container}>

      {/* back button to return to home*/}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
      <Text style={styles.backText}>←</Text>
    </TouchableOpacity>

      <TextInput
        placeholder="Focus Time!"
        placeholderTextColor="#444"
        value={task}
        onChangeText={setTask}
        style={styles.input}
        multiline={false}
        numberOfLines={2}
      />

      <View style={styles.circle}>
        <Text style={styles.timeText}>{formatTime()}</Text>
        <Text style={styles.subText}>
          {running ? "RUNNING!" : "READY TO START?"}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => setRunning(!running)}
      >
        <Text style={styles.startText}>
          {running ? "PAUSE." : "START!"}
        </Text>
      </TouchableOpacity>

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
    </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: "center", paddingTop: 60, paddingBottom: 40  },
  
  backText: {fontSize: 20, color: '#555' },
  
  backBtn: { position: "absolute", top: 50,  left: 20,  backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 20,width: 40, height: 40, alignItems: "center", justifyContent: "center", zIndex: 10, },
  
  input: { marginTop: 20, fontSize: 18, letterSpacing: 2, fontFamily: "LexendExa_400Regular", marginBottom: 40, width: "60%",
    textAlign: "center", backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 25, paddingTop: 10, paddingBottom: 10, maxHeight: 80, },

  circle: { width: 250, height: 250, borderRadius: 125, borderWidth: 18, borderColor: "#D9C4CD", justifyContent: "center",
    alignItems: "center", backgroundColor: "#FEFCFD", },

  timeText: { fontSize: 48, fontFamily: "LexendExa_600SemiBold", },

  subText: { marginTop: 8, fontSize: 12, letterSpacing: 1, fontFamily: "LexendExa_400Regular", },

  startBtn: { marginTop: 30, backgroundColor:  "rgba(255,255,255,0.8)", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20, },

  startText: { fontSize: 18, fontFamily: "LexendExa_600SemiBold",  },

  presetsContainer: { marginTop: 40, alignItems: "center", },

  row: { flexDirection: "row", justifyContent: "space-between", width: "110%", marginBottom: 40, },

  preset: {width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: "#000", 
    justifyContent: "center", alignItems: "center", backgroundColor: "#FFF", },

  presetText: { fontSize: 18, fontFamily: "LexendExa_600SemiBold", },

  minText: { fontSize: 10, fontFamily: "LexendExa_400Regular", },
});
