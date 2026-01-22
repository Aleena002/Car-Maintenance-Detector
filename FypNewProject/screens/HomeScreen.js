import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

const FeatureScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const animations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await AsyncStorage.getItem('user_session');
        if (session) {
          const sessionObj = JSON.parse(session);
          const now = new Date();
          const sessionValidUntil = new Date(sessionObj.loginTime + 24 * 60 * 60 * 1000);

          if (sessionValidUntil > now) {
            setUser(sessionObj); // ✅ session is valid
          } else {
            await AsyncStorage.removeItem('user_session'); // ❌ session expired
            setUser(null);
          }
        }
      } catch (error) {
        console.log('Session error:', error);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    Animated.stagger(
      150,
      animations.map(anim =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        })
      )
    ).start();
  }, []);

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('user_session'); // ✅ Correct key
            setUser(null);
            Alert.alert('Signed out successfully');
          } catch (error) {
            console.log('Logout error:', error);
          }
        },
      },
    ]);
  };

  const features = [
    { label: 'View Car Alignment', screen: 'CarAlignment', icon: 'car' },
    { label: 'Car Inspection', screen: 'CarInspection', icon: 'wrench' },
    { label: 'Check Ownership', screen: 'CarAuthenticity', icon: 'id-card' },
    { label: 'More', screen: 'MoreScreen', icon: 'ellipsis-h' },
   
  ];

  return (
    <View style={styles.container}>
      
        <View style={styles.header}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={styles.carDetectText}>Car Detected</Text>
        </View>

        {user ? (
          <View style={styles.userRow}>
            <Text style={styles.userText}>👋 Hello, {user.userName || 'User'}!</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <FontAwesome name="sign-out" size={20} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.authButtons}>
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.authText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.authButton}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.authText}>Signup</Text>
            </TouchableOpacity>
          </View>
        )}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/car.jpg')} style={styles.carImage} />
          <Text style={styles.caption}>Explore features of our app</Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <Animated.View
              key={index}
              style={{
                transform: [
                  {
                    scale: animations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
                opacity: animations[index],
              }}
            >
              <TouchableOpacity
                style={styles.featureButton}
                onPress={() => navigation.navigate(feature.screen)}
              >
                <FontAwesome name={feature.icon} size={28} color="navy" style={{ marginBottom: 8 }} />
                <Text style={styles.featureText}>{feature.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
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
  userRow: {
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userText: { fontSize: 16, fontWeight: 'bold' },
  logoutButton: {
    backgroundColor: 'navy',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: { color: 'white', marginLeft: 6 },
  authButtons: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  authButton: {
    backgroundColor: 'navy',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginHorizontal:   20,
    marginBottom: 40,
    marginTop: 20
  },
  authText: { color: 'white', fontSize: 15 },
  imageContainer: { alignItems: 'center', marginTop: 20 },
  carImage: {
    width: width * 0.8,
    height: 160,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  caption: { color: 'gray', marginTop: 10, textAlign: 'center' },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  featureButton: {
    width: width * 0.4,
    marginVertical: 10,
    paddingVertical: 20,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    borderRadius: 12,
  },
  featureText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
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
  navText: { color: 'white', fontSize: 12, marginTop: 4 },
});

export default FeatureScreen;
