import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const FeatureScreen = ({ navigation }) => {
  const animations = Array(10)
    .fill()
    .map(() => useRef(new Animated.Value(0)).current);

  const [userEmail, setUserEmail] = useState(null);
  const [isMechanic, setIsMechanic] = useState(false);
  const [loading, setLoading] = useState(true);

  const features = [
    { label: 'View Car Alignment', screen: 'CarAlignment', icon: 'car' },
    { label: 'Car Inspection', screen: 'CarInspection', icon: 'wrench' },
    { label: 'Check Ownership', screen: 'CarAuthenticity', icon: 'id-card' },
    { label: 'Reports', screen: 'Report', icon: 'file-text' },
    { label: 'My Booking', screen: 'MyBookings', icon: 'book' },
    { label: 'Find Car Workshop', screen: 'CheckDents', icon: 'map-marker' },
    { label: 'Find Car Mechanic', screen: 'Mechanics', icon: 'gears' },
    { label: 'Create Mechanic Account', screen: 'MechanicUpload', icon: 'user' },
    { label: 'User Profile', screen: 'Profile', icon: 'user' },
  ];

  // Add Booking Details option only if user is a mechanic
  if (isMechanic) {
    features.push({ label: 'Booking Details', screen: 'BookingDetails', icon: 'book' });
  }

  useEffect(() => {
    const checkSessionAndFetch = async () => {
      try {
        const session = await AsyncStorage.getItem('user_session');
        if (!session) {
          Alert.alert('Login Required', 'Please login first to access more features.', [
            { text: 'OK', onPress: () => navigation.replace('Login') },
          ]);
          return;
        }

        const parsed = JSON.parse(session);
        const email = parsed.userEmail;
        setUserEmail(email);

        // Check if this email exists in the Mechanic table
        const response = await fetch(
          'https://carmaintainence-default-rtdb.firebaseio.com/Mechanic.json'
        );
        const data = await response.json();

        const mechanicExists = Object.values(data || {}).some(
          (mechanic) => mechanic.email === email
        );

        setIsMechanic(mechanicExists);
      } catch (error) {
        console.error('Session/Mechanic Check Error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSessionAndFetch();

    // Start animation
    Animated.stagger(
      100,
      animations.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  const renderFeature = (item, index) => (
    <Animated.View
      key={index}
      style={[
        styles.featureContainer,
        {
          opacity: animations[index],
          transform: [
            {
              translateY: animations[index].interpolate({
                inputRange: [0, 1],
                outputRange: [5, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.featureButton}
        onPress={() => navigation.navigate(item.screen)}
      >
        <FontAwesome name={item.icon} size={28} color="#fff" />
        <Text style={styles.featureText}>{item.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Features...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>More Features</Text>
        <View style={styles.grid}>
          {features.map((item, index) => renderFeature(item, index))}
        </View>
      </ScrollView>

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

export default FeatureScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    alignItems: 'center',
    paddingBottom: 100,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 0,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  grid: {
    marginTop: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  featureContainer: {
    width: width * 0.28,
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: '#052979ff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 3,
    elevation: 4,
  },
  featureButton: {
    alignItems: 'center',
    padding: 20,
  },
  featureText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
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
  navText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
