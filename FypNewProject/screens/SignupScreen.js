import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [userNumber, setUserNumber] = useState(""); // ✅ New
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => /[A-Z]/.test(password);

  const handleSignup = async () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      valid = false;
    } else if (!validatePassword(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      valid = false;
    } else if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!userNumber || userNumber.length < 10) {
      Alert.alert("Invalid Number", "Please enter a valid phone number.");
      valid = false;
    }

    if (valid) {
      try {
        const response = await fetch(
          "https://carmaintainence-default-rtdb.firebaseio.com/users.json"
        );
        const data = await response.json();
        const users = data ? Object.values(data) : [];

        const userExists = users.some((user) => user.userEmail === email);

        if (userExists) {
          Alert.alert("User already exists!");
        } else {
          await fetch(
            "https://carmaintainence-default-rtdb.firebaseio.com/users.json",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userName: username,
                userNumber: userNumber, // ✅ Saving number
                userEmail: email,
                userPassword: password,
              }),
            }
          );
          Alert.alert("Account created successfully!");
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Signup error:", error);
        Alert.alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.carDetectText}>Car Detected</Text>
      </View>

      <Text style={styles.title}>Signup</Text>

      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      <TextInput
        placeholder="Full Name"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <TextInput
        placeholder="Phone Number"
        value={userNumber}
        onChangeText={setUserNumber}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <FontAwesome
            name={showPassword ? "eye" : "eye-slash"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeIcon}
        >
          <FontAwesome
            name={showConfirmPassword ? "eye" : "eye-slash"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;

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
    marginTop: 20,
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
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
  },
  eyeIcon: {
    padding: 5,
  },
  signupButton: {
    width: "100%",
    height: 50,
    backgroundColor: "navy",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  signupText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    color: "#0D0D22",
    marginTop: 10,
    fontSize: 14,
  },
  error: {
    color: "red",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
});
