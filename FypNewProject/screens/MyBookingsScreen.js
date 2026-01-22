import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const MyBookingsScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const session = await AsyncStorage.getItem('user_session');
        if (!session) {
          Alert.alert('Session Expired', 'Please login again.', [
            { text: 'OK', onPress: () => navigation.replace('Login') },
          ]);
          return;
        }

        const { userEmail } = JSON.parse(session);
        setUserEmail(userEmail);

        const response = await axios.get(
          'https://carmaintainence-default-rtdb.firebaseio.com/Booking.json'
        );

        const bookingsData = response.data;
        if (bookingsData) {
          const formatted = Object.keys(bookingsData).map((key) => ({
            id: key,
            ...bookingsData[key],
          }));

          const filtered = formatted.filter(
            (item) => item.senderEmail === userEmail
          );

          setBookings(filtered);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        Alert.alert('Error', 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await axios.patch(
        `https://carmaintainence-default-rtdb.firebaseio.com/Booking/${id}.json`,
        { status: 'Cancelled' }
      );

      const updated = bookings.map((b) =>
        b.id === id ? { ...b, status: 'Cancelled' } : b
      );
      setBookings(updated);
      Alert.alert('Success', 'Booking cancelled.');
    } catch (error) {
      Alert.alert('Error', 'Could not cancel booking.');
    }
  };

  const handleRating = async (id, star) => {
    try {
      await axios.patch(
        `https://carmaintainence-default-rtdb.firebaseio.com/Booking/${id}.json`,
        { rating: star }
      );

      const updated = bookings.map((b) =>
        b.id === id ? { ...b, rating: star } : b
      );
      setBookings(updated);
      Alert.alert('Thanks!', `You rated this booking ${star} star(s).`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update rating.');
    }
  };

  const renderRatingStars = (item) => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <View style={styles.starsRow}>
        {stars.map((star) => (
          <TouchableOpacity key={star} onPress={() => handleRating(item.id, star)}>
            <FontAwesome
              name={star <= (item.rating || 0) ? 'star' : 'star-o'}
              size={24}
              color="#FFD700"
              style={{ marginHorizontal: 2 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed':
        return { color: 'green' };
      case 'Cancelled':
        return { color: 'red' };
      case 'Completed':
        return { color: 'blue' };
      default:
        return { color: 'gray' };
    }
  };

  const renderBooking = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.bookingId}>Booking ID: {item.bookingId}</Text>
      <Text style={styles.text}>Mechanic: {item.mechanicName}</Text>
      <Text style={styles.text}>Mechanic Number: {item.mechanicNumber || 'N/A'}</Text>
      <Text style={styles.text}>Date: {item.date}</Text>
      <Text style={styles.text}>Time: {item.time}</Text>
      <Text style={[styles.status, getStatusStyle(item.status)]}>
        {item.status}
      </Text>

      {item.status !== 'Cancelled' && item.status !== 'Completed' && (
        <TouchableOpacity
          onPress={() => handleCancel(item.id)}
          style={styles.buttonCancel}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      )}

      {item.status === 'Completed' && renderRatingStars(item)}
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.carDetectText}>Car Detected</Text>
      </View>

      <View style={styles.booking}>
        <Text style={styles.title}>My Bookings</Text>
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBooking}
          contentContainerStyle={{ paddingBottom: 80 }}
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
    </View>
  );
};

export default MyBookingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  carDetectText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  booking: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bookingId: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    marginBottom: 2,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  buttonCancel: {
    backgroundColor: '#e53935',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#FFF',
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 10,
    alignSelf: 'flex-start',
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
