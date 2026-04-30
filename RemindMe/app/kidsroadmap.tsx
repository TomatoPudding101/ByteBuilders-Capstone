import {
  LexendExa_400Regular,
  LexendExa_600SemiBold,
  useFonts,
} from "@expo-google-fonts/lexend-exa";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
  
  export default function RoadMapScreen() {
    const { width, height } = Dimensions.get("window");
    const router = useRouter();
  
    const [fontsLoaded] = useFonts({
      LexendExa_400Regular, LexendExa_600SemiBold,
    });
  
    if (!fontsLoaded) return null;
  
    // Center + spacing
    const centerY = height / 2;
    const spacing = 140;
  
    return (
      <ImageBackground
        source={require("../assets/images/grass.jpg")}
        style={[styles.container, { width, height }]}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* title */}
          <Text style={styles.title}>R O A D M A P</Text> 
  
          {/* back button to the home screen */} 
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.push("/kidshome")}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
  
          {/* level 1 whackamole */}
          <TouchableOpacity
            style={[
              styles.levelNode,
              { top: centerY + spacing, left: width * 0.05 },
            ]}
            onPress={() => router.push("/whackamole")}
          >
            <View style={styles.star}> {/* makes the flowers */}
              <View style={[styles.starArm, { transform: [{ rotate: "0deg" }] }]} />
              <View style={[styles.starArm, { transform: [{ rotate: "45deg" }] }]} />
              <View style={[styles.starArm, { transform: [{ rotate: "90deg" }] }]} />
              <View style={[styles.starArm, { transform: [{ rotate: "135deg" }] }]} />
            </View>
            <Text style={styles.levelText}>1</Text>
          </TouchableOpacity>
  
          {/* level 2 maze game */}
          <TouchableOpacity
            style={[
              styles.levelNode,
              { top: centerY, left: width * 0.40 },
            ]}
            onPress={() => router.push("/solvemaze")}
          >
            <View style={styles.star}>
              <View style={[styles.starArm, { transform: [{ rotate: "0deg" }] }]} />
              <View style={[styles.starArm, { transform: [{ rotate: "45deg" }] }]} />
              <View style={[styles.starArm, { transform: [{ rotate: "90deg" }] }]} />
              <View style={[styles.starArm, { transform: [{ rotate: "135deg" }] }]} />
            </View>
            <Text style={styles.levelText}>2</Text>
          </TouchableOpacity>
  
          {/* level 3 tap & stop game */}
          <TouchableOpacity
            style={[
              styles.levelNode,
              { top: centerY - spacing, left: width * 0.75 },
            ]}
            onPress={() => router.push("/stopgame")}
          >
            <View style={styles.star}>
              <View style={[styles.starArm, { transform: [{ rotate: "0deg" }] }]} />
              <View style={[styles.starArm, { transform: [{ rotate: "45deg" }] }]} />
              <View style={[styles.starArm, { transform: [{ rotate: "90deg" }] }]} />
              <View style={[styles.starArm, { transform: [{ rotate: "135deg" }] }]} />
            </View>
            <Text style={styles.levelText}>3</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  
    overlay: {
      flex: 1, backgroundColor: "rgba(255,255,255,0.2)",
    },
  
    title: {
      position: "absolute", top: 100, alignSelf: "center", fontSize: 55, color: "#333",
      letterSpacing: 2, fontFamily: "LexendExa_600SemiBold", textShadowColor: "rgba(0,0,0,0.25)",
      textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4,
    },
  
    backBtn: {
      position: "absolute", top: 60, left: 10, backgroundColor: "rgba(255,255,255,0.5)",
      borderRadius: 28, width: 50, height: 50, alignItems: "center", justifyContent: "center",
      zIndex: 10,
    },
  
    backText: {
      fontSize: 24, color: "#333", fontFamily: "LexendExa_600SemiBold",
    },
  
    levelNode: {
      position: "absolute", width: 110, height: 110, alignItems: "center", justifyContent: "center",
    },
  
    star: {
      position: "absolute", width: 110, height: 110,
    },
  
    starArm: {
      position: "absolute", width: 110, height: 26, backgroundColor: "#FFD700", borderRadius: 16, top: 42, left: 0,
      shadowColor: "#FBDB65", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.6, shadowRadius: 4,
    },
  
    levelText: {
      fontSize: 36, fontWeight: "bold", color: "#FF4500", zIndex: 2, fontFamily: "LexendExa_600SemiBold",
      textShadowColor: "rgba(0,0,0,0.35)", textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 5,
    },
  });