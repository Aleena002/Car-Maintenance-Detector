import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔐 Check for active session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await AsyncStorage.getItem("user_session");
        if (session) {
          const sessionData = JSON.parse(session);
          const sessionAge = Date.now() - sessionData.loginTime;
          const oneDay = 24 * 60 * 60 * 1000;

          if (sessionAge < oneDay) {
            navigation.replace("Home"); 
          } else {
            await AsyncStorage.removeItem("user_session"); 
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };

    checkSession();
  }, []);

  // 🔐 Handle Login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch(
        "https://carmaintainence-default-rtdb.firebaseio.com/users.json"
      );

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      const users = data ? Object.values(data) : [];

      const matchedUser = users.find(
        (user) =>
          user.userEmail === email && user.userPassword === password
      );

      if (matchedUser) {
        // Save session with timestamp
        const sessionData = {
          ...matchedUser,
          loginTime: Date.now(),
        };

        await AsyncStorage.setItem("user_session", JSON.stringify(sessionData));
        console.log("✅ Session saved:", sessionData);

        Alert.alert("Login successful!");
        navigation.replace("Home");
      } else {
        Alert.alert("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.carDetectText}>Car Detected</Text>
      </View>

      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email Address"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome
            name={showPassword ? "eye-slash" : "eye"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.signupLink}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('VerifyEmail')}>
        <Text style={{ color: 'blue', textAlign: 'center', marginTop: 15 }}>
          Forgot your password? 
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
  },
  carDetectText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordContainer: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "navy",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  loginText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupLink: {
    color: "#0D0D22",
    marginTop: 10,
    fontSize: 14,
  },
  forgotPassword: {
    color: "#888",
    marginTop: 10,
    fontSize: 14,
  },
});

export default LoginScreen;
