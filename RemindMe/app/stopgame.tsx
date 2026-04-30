import { router } from "expo-router";
import React from "react";
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function BackgroundOnly() {
  const { width, height } = Dimensions.get("window");

  return (
    <>
      <ImageBackground
        source={require("../assets/images/game3.jpg")}
        style={{ width, height }}
        resizeMode="cover"
      >
      </ImageBackground>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.push("/kidsroadmap")}
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  backBtn: { position: "absolute", top: 60, left: 10, backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 28,
    width: 50, height: 50, alignItems: "center", justifyContent: "center", zIndex: 10,},

  backText: { fontSize: 24, color: "#333", fontFamily: "LexendExa_600SemiBold", },
});