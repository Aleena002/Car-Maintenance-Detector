import React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Platform,
  Image
} from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";

const Authenticity = ({ navigation }) => {
  return (
    <LinearGradient colors={["#f7f8fc", "#e0e5ec"]} style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.carDetectText}>Car Detected</Text>
      </View>
      <View style={styles.webviewWrapper}>
        <WebView
          source={{ uri: "http://mtmis.excise.punjab.gov.pk/" }}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#00796b" />
              <Text style={styles.loadingText}>Loading MTMIS Website...</Text>
            </View>
          )}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={["*"]}
          allowsInlineMediaPlayback={true}
        />
      </View>

      <View style={styles.bottomNav}>
        {[
          { name: 'home', label: 'Home', screen: 'Home' },
          { name: 'camera', label: 'Scan', screen: 'Scan' },
          { name: 'user', label: 'Profile', screen: 'Profile' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navButton}
            onPress={() => navigation.navigate(item.screen)}
          >
            <FontAwesome name={item.name} size={24} color="white" />
            <Text style={styles.navText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 40 : 60,
  },
  header: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: { width: 60, height: 60, resizeMode: 'contain' },
  carDetectText: { marginLeft: 10, fontSize: 18, fontWeight: 'bold' },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#37474f",
    textAlign: "center",
    marginBottom: 10,
  },
  webviewWrapper: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginBottom: 70, // space for bottom nav
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#00796b",
    fontSize: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'navy',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navButton: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  navText: { color: 'white', fontSize: 12, marginTop: 4 },
});

export default Authenticity;
