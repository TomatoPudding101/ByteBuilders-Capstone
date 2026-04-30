/* eslint-disable react/no-unescaped-entities */
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";


// time limit for the game (will change it in future)
const GAME_DURATION = 30;

export default function WhackGame() {
  const [moleIndex, setMoleIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<"start" | "playing" | "end">("start");

  useEffect(() => {
    if (gameState !== "playing") return;

    const moleTimer = setInterval(() => 
    {
      setMoleIndex(Math.floor(Math.random() * 9));
     }, 700);

    const countdown = setInterval(() => 
    {
      setTimeLeft((t) => {
        if (t <= 1) 
        {
          setGameState("end");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(moleTimer);
      clearInterval(countdown);
    };
  }, [gameState]);

  const hitMole = (index: number) => {
    if (gameState !== "playing") return;

    if (index === moleIndex) {
      setScore((prev) => prev + 1);
      setMoleIndex(null);
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState("playing");
  };

  const renderStartScreen = () => (
    <View style={styles.center}>
      <View style={styles.titleBubble}>
        <Text style={styles.title}>Whack-A-Mole</Text>
      </View>

      <View style={styles.rulesCard}>
        <Text style={styles.ruleLine}>Tap the character when you see it.</Text>
        <Text style={styles.ruleLine}>Be super fast & get points!</Text>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={startGame} activeOpacity={0.7}>
        <Text style={styles.btnText}>START GAME</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGame = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.timer}>Time: {timeLeft}s</Text>
      </View>

      <View style={styles.grid}>
        {[...Array(9)].map((_, i) => (
          <TouchableOpacity
            key={i}
            style={styles.hole}
            activeOpacity={0.8}
            onPress={() => hitMole(i)}
          >
            <View style={styles.holeInner}>
              {moleIndex === i && <View style={styles.mole} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderEndScreen = () => (
    <View style={styles.center}>
      <Text style={styles.title}>Time's Up!</Text>
      <Text style={styles.finalScore}>Points: {score}</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={startGame} activeOpacity={0.7}>
        <Text style={styles.btnText}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <><ImageBackground
          source={require('../assets/images/grass.jpg')}
          style={styles.background}
          resizeMode="cover"
      >
          <View style={styles.overlay}>
              {gameState === "start" && renderStartScreen()}
              {gameState === "playing" && renderGame()}
              {gameState === "end" && renderEndScreen()}
          </View>
      </ImageBackground> <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => router.push("/kidsroadmap")}
      >
              <Text style={styles.backText}>←</Text>
          </TouchableOpacity></>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1,},

  overlay: {  flex: 1, paddingTop: 60, alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", },

  container: {flex: 1,},

  header: { width: "90%", flexDirection: "row", justifyContent: "space-between", marginBottom: 20,},

  score: { fontSize: 24, fontWeight: "700", letterSpacing: 1, color: "#1F2937", },

  timer: { fontSize: 24, fontWeight: "700", letterSpacing: 1, color: "#D62828",},

  grid: { width: 320, flexDirection: "row", flexWrap: "wrap", justifyContent: "center", },

  hole: { width: 100, height: 100, margin: 6, borderRadius: 50,
    backgroundColor: "#A1887F", alignItems: "center", justifyContent: "center", },

  holeInner: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#6D4C41", 
    alignItems: "center", justifyContent: "flex-end", overflow: "hidden", },

  mole: { width: 50, height: 50, backgroundColor: "#3E2723", borderRadius: 25, marginBottom: 6,},

  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24,},

  titleBubble: { backgroundColor: "#FFE082", paddingVertical: 10, paddingHorizontal: 20,borderRadius: 20, marginBottom: 20,},

  title: { fontSize: 34, fontWeight: "800", letterSpacing: 1, color: "#3E2723",},

  rulesCard: { backgroundColor: "#FFFFFF", paddingVertical: 22, paddingHorizontal: 28, borderRadius: 20, marginBottom: 30, 
    alignItems: "center", borderWidth: 2, borderColor: "#E0E0E0",},

  ruleLine: { fontSize: 18, fontWeight: "700", color: "#374151", marginVertical: 6, },

  finalScore: {fontSize: 28, fontWeight: "700", marginBottom: 20, color: "#1F2937",  },

  primaryBtn: {backgroundColor: "#66BB6A", paddingVertical: 16, paddingHorizontal: 50, borderRadius: 20,
    shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 5, elevation: 4, },

  btnText: { color: "white", fontSize: 22, fontWeight: "800", letterSpacing: 1, },
 
  backBtn: {  position: "absolute", top: 60, left: 10, backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 28, width: 50, height: 50, alignItems: "center", justifyContent: "center",
    zIndex: 10, },

  backText: {fontSize: 24, color: "#333", fontFamily: "LexendExa_600SemiBold", },

});