import React, { useEffect, useState } from "react";
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, Share, Alert, ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReportScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load session and fetch data
  useEffect(() => {
    const checkSessionAndFetchReports = async () => {
      try {
        const session = await AsyncStorage.getItem('user_session');
        if (!session) {
          Alert.alert(
            "Login Required",
            "Please login to view your reports.",
            [{ text: "OK", onPress: () => navigation.replace("Login") }]
          );
          return;
        }

        const parsedSession = JSON.parse(session);
        const email = parsedSession.userEmail;
        setUserEmail(email);
        console.log("📧 Logged-in user:", email);

        // Fetch reports from Firebase
        const response = await fetch("https://carmaintainence-default-rtdb.firebaseio.com/report.json");
        const data = await response.json();

        // Filter reports for this user
        const userReports = Object.values(data || {}).filter(
          item => item.email === email
        );

        setReports(userReports);
        setLoading(false);
      } catch (err) {
        console.error("Session/Data Error:", err);
        setLoading(false);
      }
    };

    checkSessionAndFetchReports();
  }, []);

  const handleSaveReport = () => {
    console.log('Report saved');
  };

  const handleShareReport = async () => {
    try {
      const message = `Your Reports:\n\n${reports.map((r, i) =>
        `#${i + 1}\nType: ${r.type}\nURL: ${r.output_url}\nTime: ${r.timestamp}`
      ).join('\n\n')}`;

      const result = await Share.share({ message });
      if (result.action === Share.sharedAction) {
        console.log("Report shared!");
      }
    } catch (error) {
      console.error("Sharing Error:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="navy" />
        <Text style={{ marginTop: 10 }}>Loading Reports...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.carDetectText}>Your Reports</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {reports.length === 0 ? (
            <Text style={{ textAlign: 'center', padding: 20 }}>No reports found for {userEmail}</Text>
          ) : (
            reports.map((report, index) => (
              <View key={index} style={styles.section}>
                <Image source={{ uri: report.output_url }} style={styles.reportImage} />
                <Text style={styles.sectionTitle}>{report.type.toUpperCase()}</Text>
                <Text style={styles.description}>Time: {new Date(report.timestamp).toLocaleString()}</Text>
              </View>
            ))
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
        
          <TouchableOpacity style={styles.button} onPress={handleShareReport}>
            <Text style={styles.buttonText}>Share Report</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav navigation={navigation} />
    </SafeAreaView>
  );
};

// Bottom Navigation Bar
const BottomNav = ({ navigation }) => (
  <View style={styles.bottomNav}>
    {[
      { name: 'home', label: 'Home', screen: 'Home' },
      { name: 'camera', label: 'Scan', screen: 'Scan' },
      { name: 'user', label: 'Profile', screen: 'Profile' }
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
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 70,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  carDetectText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 100,
  },
  card: {
    backgroundColor: "#FFF",
    width: "100%",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  section: {
    alignItems: "center",
    marginBottom: 15,
  },
  reportImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    textTransform: "uppercase",
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    backgroundColor: 'navy',
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'navy',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navButton: { alignItems: 'center' },
  navText: { color: 'white', fontSize: 12, marginTop: 5 },
});

export default ReportScreen;
