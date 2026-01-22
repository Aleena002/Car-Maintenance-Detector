import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingScreen = ({ route, navigation }) => {
  const { mechanic } = route.params;

  const [selectedService, setSelectedService] = useState(mechanic.services[0]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [comment, setComment] = useState('');
  const [address, setAddress] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [userSession, setUserSession] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [locationCoords, setLocationCoords] = useState({
    latitude: 31.5204,
    longitude: 74.3587,
  });

  useEffect(() => {
    const checkSessionAndFetchMechanic = async () => {
      try {
        const session = await AsyncStorage.getItem('user_session');
        if (!session) {
          Alert.alert('Login Required', 'Please login to book a service.', [
            { text: 'OK', onPress: () => navigation.replace('Login') },
          ]);
          return;
        }
        const parsedSession = JSON.parse(session);
        const email = parsedSession.userEmail;
        const userName = parsedSession.userName;
        const userNumber = parsedSession.userNumber;

        setUserEmail(email);
        setUserPhone(userNumber || '');
        setUserSession(parsedSession);
      } catch (err) {
        console.error('Session Error:', err);
      }
    };
    checkSessionAndFetchMechanic();
  }, []);

 const handleBooking = async () => {
  if (!address.trim()) {
    Alert.alert('Required', 'Please select or enter your address.');
    return;
  }

  if (!userSession) {
    Alert.alert('Session Error', 'User session not found. Please login again.');
    return;
  }

  const bookingId = 'BK' + Date.now();
  const mechanicName = mechanic.name;
  const mechanicNumber = mechanic.phone;
  const date = selectedDate.toLocaleDateString();
  const time = selectedDate.toLocaleTimeString();

  const senderEmail = userSession.userEmail;
  const senderName = userSession.userName;
  const senderPhone = userPhone || '';
  const receiverEmail = mechanic.email || 'unknown';

  const bookingData = {
    bookingId,
    mechanicName,
    mechanicNumber,
    service: selectedService,
    date,
    time,
    address,
    comment,
    status: 'Processing',
    senderName,
    senderEmail,
    senderPhone,
    receiverEmail,
  };

  try {
    // 🔍 Fetch all existing bookings first
    const res = await fetch(
      'https://carmaintainence-default-rtdb.firebaseio.com/Booking.json'
    );
    const bookings = await res.json();

    const hasSameDateBooking = Object.values(bookings || {}).some(
      (b) =>
        b.receiverEmail === receiverEmail &&
        b.date === date &&
        b.status !== 'Cancelled' &&
        b.status !== 'Completed'
    );

    if (hasSameDateBooking) {
      Alert.alert(
        'Slot Full',
        'This date is already booked. Please select another date.'
      );
      return;
    }

    // ✅ Proceed to book if slot is free
    const response = await fetch(
      'https://carmaintainence-default-rtdb.firebaseio.com/Booking.json',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      }
    );

    if (response.ok) {
      navigation.navigate('BookingConfirmation', {
        bookingId,
        mechanicName,
        date,
        time,
        address,
      });
    } else {
      Alert.alert('Error', 'Booking failed. Please try again.');
    }
  } catch (error) {
    console.error('Firebase error:', error);
    Alert.alert('Error', 'Failed to connect to server.');
  }
};


  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocationCoords(location.coords);

    let geocode = await Location.reverseGeocodeAsync(location.coords);
    if (geocode.length > 0) {
      const loc = geocode[0];
      const fullAddress = `${loc.name || ''}, ${loc.street || ''}, ${loc.city || ''}`;
      setAddress(fullAddress);
    }
  };

  const handleConfirmMapLocation = async () => {
    const geocode = await Location.reverseGeocodeAsync(locationCoords);
    if (geocode.length > 0) {
      const loc = geocode[0];
      const fullAddress = `${loc.name || ''}, ${loc.street || ''}, ${loc.city || ''}`;
      setAddress(fullAddress);
    }
    setModalVisible(false);
  };

  const recenterLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocationCoords(location.coords);
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location.');
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={styles.carDetectText}>Car Detected</Text>
        </View>

        <View style={styles.book}>
          <Text style={styles.heading}>Book Appointment with {mechanic.name}</Text>

          <Text style={styles.label}>Choose Service</Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={selectedService}
              onValueChange={(itemValue) => setSelectedService(itemValue)}
            >
              {mechanic.services.map((service, index) => (
                <Picker.Item key={index} label={service} value={service} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Select Date & Time</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString()} - {selectedDate.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (event.type === 'dismissed' || !date) return;
                const updated = new Date(date);
                updated.setHours(selectedDate.getHours());
                updated.setMinutes(selectedDate.getMinutes());
                setSelectedDate(updated);
                if (Platform.OS === 'android') setShowTimePicker(true);
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display="default"
              onChange={(event, time) => {
                setShowTimePicker(false);
                if (event.type === 'dismissed' || !time) return;
                const updated = new Date(selectedDate);
                updated.setHours(time.getHours());
                updated.setMinutes(time.getMinutes());
                setSelectedDate(updated);
              }}
            />
          )}

          <Text style={styles.label}>Phone Number</Text>
            <TextInput
              placeholder="Enter your phone number"
              style={styles.input}
              value={userPhone}
              onChangeText={setUserPhone}
              keyboardType="phone-pad"
            />

          <Text style={styles.label}>Address</Text>
          <TextInput
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
              <FontAwesome name="location-arrow" size={16} color="white" />
              <Text style={styles.locationButtonText}>Use Current Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.locationButton, { backgroundColor: 'gray' }]}
              onPress={() => setModalVisible(true)}
            >
              <FontAwesome name="map" size={16} color="white" />
              <Text style={styles.locationButtonText}>Choose on Map</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Comments (optional)</Text>
          <TextInput
            placeholder="e.g., Car overheating issue"
            value={comment}
            onChangeText={setComment}
            multiline
            style={styles.commentBox}
          />

          <TouchableOpacity style={styles.confirmButton} onPress={handleBooking}>
            <Text style={styles.confirmText}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomNav}>
          {[{ name: 'home', label: 'Home', screen: 'Home' },
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
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            region={{
              latitude: locationCoords.latitude,
              longitude: locationCoords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={(e) => setLocationCoords(e.nativeEvent.coordinate)}
          >
            <Marker coordinate={locationCoords} draggable />
          </MapView>

          <View style={styles.mapButtons}>
            <TouchableOpacity
              onPress={recenterLocation}
              style={[styles.mapBtn, { backgroundColor: 'gray' }]}
            >
              <Text style={styles.mapBtnText}>Recenter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirmMapLocation}
              style={[styles.mapBtn, { backgroundColor: 'navy' }]}
            >
              <Text style={styles.mapBtnText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default BookingScreen;


const styles = StyleSheet.create({
  container: { backgroundColor: 'white', flexGrow: 1 },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: { width: 60, height: 60, resizeMode: 'contain' },
  carDetectText: { marginLeft: 10, fontSize: 18, fontWeight: 'bold' },
  book: { padding: 15 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { fontWeight: '600', marginTop: 10, marginBottom: 5 },
  dropdown: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    overflow: 'hidden',
  },
  dateButton: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  dateText: { color: '#333' },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
  },
  locationButton: {
    flexDirection: 'row',
    backgroundColor: 'navy',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  locationButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 13,
  },
  commentBox: {
    height: 100,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    textAlignVertical: 'top',
    marginTop: 5,
  },
  confirmButton: {
    backgroundColor: 'navy',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFF',
    fontWeight: 'bold',
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
  mapButtons: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapBtn: {
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  mapBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
