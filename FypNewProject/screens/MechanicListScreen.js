import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MechanicCard = ({ mechanic, navigation, onBook }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('MechanicDetail', { mechanic })}
    style={styles.card}
  >
    <Image source={{ uri: mechanic.image }} style={styles.image} />
    <View style={styles.info}>
      <Text style={styles.name}>{mechanic.name}</Text>
      {mechanic.workshopName && (
        <Text style={styles.workshop}>{mechanic.workshopName}</Text>
      )}
      <Text style={styles.services}>🛠 {mechanic.services?.join(', ')}</Text>
      <Text style={styles.location}>
        <Entypo name="location-pin" size={16} color="gray" /> {mechanic.address}
      </Text>
      <View style={styles.row}>
        <FontAwesome name="star" size={16} color="#FFD700" />
        <Text style={styles.rating}>{mechanic.rating || '4.5'} / 5</Text>
      </View>
      <Text style={styles.price}>Starting from Rs. {mechanic.price}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => Linking.openURL(`tel:${mechanic.phone}`)}
        >
          <MaterialIcons name="call" size={20} color="green" />
          <Text style={styles.phoneText}>{mechanic.phone}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('Booking', { mechanic })}
        >
          <Text style={styles.bookText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const MechanicListScreen = ({ navigation }) => {
  const [mechanics, setMechanics] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionEmail, setSessionEmail] = useState(null);

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const session = await AsyncStorage.getItem('user_session');
        const parsedSession = JSON.parse(session);
        const email = parsedSession?.userEmail;
        setSessionEmail(email);

        const response = await fetch(
          'https://carmaintainence-default-rtdb.firebaseio.com/Mechanic.json'
        );
        const data = await response.json();

        if (data) {
          const mechanicArray = Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter((m) => m.email !== email); // 👈 Hide own profile
          setMechanics(mechanicArray);
        }
      } catch (error) {
        console.error('Error fetching mechanics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMechanics();
  }, []);

  const checkBookingAvailability = async (mechanic) => {
    try {
      const response = await fetch(
        'https://carmaintainence-default-rtdb.firebaseio.com/Booking.json'
      );
      const data = await response.json();
      const today = new Date().toLocaleDateString();

      const hasConflict = Object.values(data || {}).some(
        (booking) =>
          booking.receiverEmail === mechanic.email &&
          booking.date === today &&
          booking.status !== 'Cancelled' &&
          booking.status !== 'Completed'
      );

      if (hasConflict) {
        Alert.alert('Slot Full', 'This mechanic is already booked today.');
      } else {
        navigation.navigate('Booking', { mechanic });
      }
    } catch (err) {
      console.error('Error checking booking availability:', err);
      Alert.alert('Error', 'Unable to verify booking slot.');
    }
  };

  const filteredMechanics = mechanics.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.location?.toLowerCase().includes(search.toLowerCase()) ||
      m.services?.join(' ')?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.carDetectText}>Car Detected</Text>
      </View>

      <View style={styles.searchBox}>
        <FontAwesome name="search" size={18} color="gray" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search mechanic, location or service..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor="#888"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="navy" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={filteredMechanics}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MechanicCard
              mechanic={item}
              navigation={navigation}
              onBook={checkBookingAvailability}
            />
          )}
          ListFooterComponent={<View style={{ height: 100 }} />}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 30, color: 'gray' }}>
              No mechanics found.
            </Text>
          }
        />
      )}

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

export default MechanicListScreen;

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', flex: 1 },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: { width: 60, height: 60, resizeMode: 'contain' },
  carDetectText: { marginLeft: 10, fontSize: 18, fontWeight: 'bold' },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
    marginTop: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 40,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#000' },

  list: { padding: 15, paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: 100, height: 100, borderRadius: 10 },
  info: { flex: 1, paddingLeft: 12 },
  name: { fontSize: 18, fontWeight: 'bold' },
  workshop: { fontSize: 14, fontStyle: 'italic', color: '#555' },
  services: { fontSize: 13, marginTop: 2, color: '#555' },
  location: { fontSize: 13, color: 'gray', marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  rating: { fontSize: 13, marginLeft: 5 },
  price: { fontSize: 14, fontWeight: '600', marginTop: 4, color: '#000' },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callButton: { flexDirection: 'row', alignItems: 'center' },
  phoneText: { marginLeft: 5, color: 'green', fontSize: 13 },
  bookButton: {
    backgroundColor: 'navy',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  bookText: { color: 'white', fontWeight: 'bold' },
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
  navButton: { alignItems: 'center', paddingHorizontal: 10 },
  navText: { color: 'white', fontSize: 12, marginTop: 4 },
});
