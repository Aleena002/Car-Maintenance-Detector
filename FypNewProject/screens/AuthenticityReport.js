import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';

const AuthenticityReportScreen = ({ navigation }) => {
  const handleSaveReport = () => {
    Alert.alert('Report Saved', 'The report has been saved locally.');
  };

  const handleShareReport = async () => {
    try {
      await Sharing.shareAsync('https://yourreportlink.com');
    } catch (error) {
      Alert.alert('Error', 'Unable to share the report.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header same as Home screen */}
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.carDetectText}>Car Authenticity Verified</Text>
      </View>

      {/* Title */}
      <Text style={styles.headerText}>Authenticity Report</Text>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={styles.imageGrid}>
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtSPdPm4_is8FFsiEJibBSrlbywTcwJcuwSQ&s',
            }}
            style={styles.image}
          />
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYYvsfp0ZST3QWb9qLm5Zej1x0_nMfeQ69oJUh9YI4YOQj_PcBQ3vAx6i-31eKBbHZ5EM&usqp=CAU',
            }}
            style={styles.image}
          />
        </View>

        <Text style={styles.description}>
          The back bumper is not original, but all other parts are original.
        </Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button} onPress={handleSaveReport}>
            <Text style={styles.buttonText}>Save Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleShareReport}>
            <Text style={styles.buttonText}>Share Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  // Same Header Style
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
  headerText: {
    marginTop: 130, // To move below logo
    fontSize: 20,
    fontWeight: 'bold',
    color: 'navy',
    textAlign: 'center',
    marginBottom: 10,
  },
  imageGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 10,
    margin: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: 'gray',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
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
    fontWeight: 'bold',
    fontSize: 14,
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
  navButton: {
    alignItems: 'center',
  },
  navText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
});

export default AuthenticityReportScreen;
