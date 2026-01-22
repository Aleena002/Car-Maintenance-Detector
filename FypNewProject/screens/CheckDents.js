import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const CarWorkshopMap = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.carDetectText}>Car Detected</Text>
      </View>

      <View style={styles.webviewContainer}>
        <WebView source={{ uri: 'https://www.google.com/maps/search/car+workshop+near+me/' }} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: { width: 60, height: 60, resizeMode: 'contain' },
  carDetectText: { marginLeft: 10, fontSize: 18, fontWeight: 'bold' },
  webviewContainer: {
    flex: 1,
    marginBottom: 70, 
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

export default CarWorkshopMap;
