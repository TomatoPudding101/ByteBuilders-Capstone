import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// maze of the game (will use it to create more levels in the future)
const maze = [
  [0, 0, 1, 0],
  [0, 0, 1, 0],
  [1, 0, 0, 0],
  [0, 1, 1, 0],
];

const START = { x: 0, y: 0 };
const GOAL = { x: 3, y: 3 };

export default function MazeGame() {
  const { width, height } = Dimensions.get("window");
  const [player, setPlayer] = useState(START);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState<"start" | "playing" | "end">(
    "start"
  );

  // when the game is completed
  useEffect(() => {
    if (player.x === GOAL.x && player.y === GOAL.y && gameState === "playing") {
      setGameState("end");
    }
  }, [player, gameState]);

  const move = (dx: number, dy: number) => {
    if (gameState !== "playing") return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    if (maze[newY] && maze[newY][newX] === 0) {
      setPlayer({ x: newX, y: newY });
      setMoves((m) => m + 1);
    }
  };

  const startGame = () => {
    setPlayer(START);
    setMoves(0);
    setGameState("playing");
  };

  // instructions for game
  const renderStart = () => (
    <View style={styles.center}>
      <View style={styles.titleBubble}>
        <Text style={styles.title}>Maze Game</Text>
      </View>
      <View style={styles.rulesCard}>
        <Text style={styles.ruleLine}>Reach the green square</Text>
        <Text style={styles.ruleLine}>Click the blue buttons to move!</Text>
      </View>
      <TouchableOpacity style={styles.primaryBtn} onPress={startGame}>
        <Text style={styles.btnText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );

// controls of the game screen & main game section
  const renderGame = () => (
    <>
      <Text style={styles.moves}>Moves: {moves}</Text>
      <View style={styles.grid}>
        {maze.map((row, y) => (
          <View key={y} style={styles.row}>
            {row.map((cell, x) => {
              const isPlayer = player.x === x && player.y === y;
              const isGoal = x === GOAL.x && y === GOAL.y;
              return (
                <View
                  key={x}
                  style={[styles.cell, cell === 1 && styles.wall, isGoal && styles.goal]}>
                  {isPlayer && <View style={styles.player} />}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.ctrlBtn} onPress={() => move(0, -1)}>
          <Text style={styles.ctrlText}>↑</Text>
        </TouchableOpacity>

        <View style={styles.middleRow}>
          <TouchableOpacity style={styles.ctrlBtn} onPress={() => move(-1, 0)}>
            <Text style={styles.ctrlText}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ctrlBtn} onPress={() => move(1, 0)}>
            <Text style={styles.ctrlText}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.ctrlBtn} onPress={() => move(0, 1)}>
          <Text style={styles.ctrlText}>↓</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // game over screen
  const renderEnd = () => (
    <View style={styles.center}>
      <View style={styles.titleBubble}>
        <Text style={styles.title}>You Win!</Text>
      </View>

      <Text style={styles.moves}>Moves: {moves}</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={startGame}>
        <Text style={styles.btnText}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <><ImageBackground
          source={require("../assets/images/grass.jpg")}
          style={{ width, height }}
          resizeMode="cover"
      >
          <View style={styles.overlay}>
              {gameState === "start" && renderStart()}
              {gameState === "playing" && renderGame()}
              {gameState === "end" && renderEnd()}
          </View>
      </ImageBackground> 
      <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push("/kidsroadmap")}
      >
              <Text style={styles.backText}>←</Text>
          </TouchableOpacity></>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center", },

  center: { alignItems: "center", paddingHorizontal: 24,  },

  titleBubble: { backgroundColor: "#FFE082", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, marginBottom: 20, },

  title: {fontSize: 32, fontWeight: "800", letterSpacing: 1, color: "#3E2723", },

  rulesCard: {
    backgroundColor: "#FFFFFF", paddingVertical: 22, paddingHorizontal: 28, borderRadius: 20,
    marginBottom: 30, alignItems: "center", borderWidth: 2, borderColor: "#E0E0E0",
  },

  ruleLine: { fontSize: 18, fontWeight: "700", color: "#374151", marginVertical: 6, },

  moves: { fontSize: 20, fontWeight: "700", marginBottom: 15, color: "#1F2937", },

  grid: { marginBottom: 30, },

  row: { flexDirection: "row", },

  cell: { width: 60, height: 60, margin: 5, borderRadius: 12,
    backgroundColor: "#E0E0E0", alignItems: "center", justifyContent: "center", },

  wall: { backgroundColor: "#424242", },

  goal: {backgroundColor: "#66BB6A", },
 
  player: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#1E88E5", },

  controls: { alignItems: "center", gap: 12, },

  middleRow: { flexDirection: "row", gap: 20, },

  ctrlBtn: { backgroundColor: "#64B5F6", width: 65, height: 65, borderRadius: 32, alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, elevation: 3, },

  ctrlText: { color: "white", fontSize: 26, fontWeight: "800",  },

  primaryBtn: { backgroundColor: "#66BB6A", paddingVertical: 16, paddingHorizontal: 50, 
    borderRadius: 20, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 5,elevation: 4, },

  btnText: { color: "white", fontSize: 22, fontWeight: "800", letterSpacing: 1, },
  
  backBtn: {  position: "absolute", top: 60, left: 10, backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 28, width: 50, height: 50, alignItems: "center", justifyContent: "center", zIndex: 10, },

  backText: {fontSize: 24, color: "#333", fontFamily: "LexendExa_600SemiBold", },

});