import React from "react";
import { 
  View, Text, ImageBackground, TouchableOpacity, 
  StyleSheet, Image 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Splash = ({ navigation }) => {
  return (
    <ImageBackground source={require("../assets/background.jpg")} style={styles.background}>
      <LinearGradient colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.8)"]} style={styles.overlay}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.appName}>Car Detector</Text>

        {/* Get Started Button */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 100,
  },
  title: {
    fontSize: 36,
    color: "#FFF",
    fontWeight: "bold",
    marginTop: 50,
  },
  appName: {
    fontSize: 30,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "blue",
    width: "80%",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 30,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Splash;
