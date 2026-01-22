import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  Linking, // ✅ added for call functionality
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const BookingDetailsScreen = ({ navigation }) => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  const fetchBookings = async (email) => {
    try {
      const response = await axios.get(
        'https://carmaintainence-default-rtdb.firebaseio.com/Booking.json'
      );
      const bookings = response.data;

      if (bookings) {
        const formatted = Object.keys(bookings).map((key) => ({
          id: key,
          ...bookings[key],
        }));

        const filtered = formatted.filter(
          (item) => item.receiverEmail === email
        );

        setBookingData(filtered);
      } else {
        setBookingData([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await axios.patch(
        `https://carmaintainence-default-rtdb.firebaseio.com/Booking/${bookingId}.json`,
        { status: newStatus }
      );
      Alert.alert('Success', `Booking marked as ${newStatus}`);
      fetchBookings(userEmail);
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const makeCall = (number) => {
    if (number) {
      Linking.openURL(`tel:${number}`).catch((err) =>
        Alert.alert('Error', 'Unable to make a call')
      );
    }
  };

  useEffect(() => {
    const checkSessionAndFetch = async () => {
      try {
        const session = await AsyncStorage.getItem('user_session');
        if (!session) {
          Alert.alert('Login Required', 'Please login to view your bookings.', [
            { text: 'OK', onPress: () => navigation.replace('Login') },
          ]);
          return;
        }

        const parsedSession = JSON.parse(session);
        const email = parsedSession.userEmail;
        setUserEmail(email);
        fetchBookings(email);
      } catch (err) {
        console.error('Session/Data Error:', err);
        setLoading(false);
      }
    };

    checkSessionAndFetch();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (!bookingData || bookingData.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={styles.carDetectText}>Car Detected</Text>
        </View>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No Booking Data Found</Text>
        </View>
        <BottomNavigation navigation={navigation} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#001f3f" barStyle="light-content" />
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.carDetectText}>Car Detected</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {bookingData.map((item, index) => (
          <View key={item.id || index} style={styles.card}>
            <Text style={styles.label}>Booking ID:</Text>
            <Text style={styles.value}>{item.bookingId}</Text>

            <Text style={styles.label}>Sender Name:</Text>
            <Text style={styles.value}>{item.senderName}</Text>

            <Text style={styles.label}>Sender Contact:</Text>
            <TouchableOpacity onPress={() => makeCall(item.senderPhone)}>
              <Text style={[styles.value, { color: 'blue', textDecorationLine: 'underline' }]}>
                {item.senderPhone || 'N/A'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Service:</Text>
            <Text style={styles.value}>{item.service}</Text>

            <Text style={styles.label}>Date & Time:</Text>
            <Text style={styles.value}>{item.date} at {item.time}</Text>

            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{item.address}</Text>

            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{item.status}</Text>

            <Text style={styles.label}>Comment:</Text>
            <Text style={styles.value}>{item.comment || 'No comment'}</Text>

            {item.status === 'Completed' && (
              <>
                <Text style={styles.label}>Rating:</Text>
                <Text style={styles.value}>{item.rating || 'No comment'}/5</Text>
              </>
            )}

            <View style={styles.buttonRow}>
              {item.status === 'Processing' && (
                <>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#4CAF50' }]}
                    onPress={() => updateStatus(item.id, 'Confirmed')}
                  >
                    <Text style={styles.buttonText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#f44336' }]}
                    onPress={() => updateStatus(item.id, 'Cancelled')}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}

              {item.status === 'Confirmed' && (
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: 'orange' }]}
                  onPress={() => updateStatus(item.id, 'Completed')}
                >
                  <Text style={styles.buttonText}>Mark as Completed</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <BottomNavigation navigation={navigation} />
    </SafeAreaView>
  );
};

const BottomNavigation = ({ navigation }) => (
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
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  carDetectText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#001f3f',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    marginBottom: 8,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 200,
  },
  noDataText: {
    fontSize: 18,
    color: '#777',
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
});

export default BookingDetailsScreen;
