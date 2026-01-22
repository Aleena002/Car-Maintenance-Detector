import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { bookingId, mechanicName, date, time ,address} = route.params;

  const handleGoToBookings = () => {
    navigation.navigate('MyBookings');
  };

  return (
    <View style={styles.container}>
      <FontAwesome name="check-circle" size={100} color="#1d4581ff" style={styles.icon} />
      <Text style={styles.title}>Booking Confirmed!</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>🆔 <Text style={styles.label}>Booking ID:</Text> {bookingId}</Text>
        <Text style={styles.infoText}>👨‍🔧 <Text style={styles.label}>Mechanic:</Text> {mechanicName}</Text>
        <Text style={styles.infoText}>📍 <Text style={styles.label}>Address:</Text> {address}</Text>
        <Text style={styles.infoText}>📅 <Text style={styles.label}>Date:</Text> {date}</Text>
        <Text style={styles.infoText}>⏰ <Text style={styles.label}>Time:</Text> {time}</Text>
      </View>


      <TouchableOpacity style={styles.button} onPress={handleGoToBookings}>
        <Text style={styles.buttonText}>Go to My Bookings</Text>
      </TouchableOpacity>
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

export default BookingConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1d4581ff',
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: '#f0f4ff',
    padding: 20,
    borderRadius: 15,
    width: width * 0.9,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 6,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#1d4581ff',
  },
  button: {
    backgroundColor: '#1d4581ff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
