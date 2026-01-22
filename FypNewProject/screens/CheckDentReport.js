import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';

const mechanics = [
  {
    id: '1',
    name: 'Ali Ustaad',
    workshopName: 'Ali Auto Workshop',
    phone: '03001234567',
    location: 'Model Town, Lahore',
    rating: 4.7,
    services: ['AC Repair', 'Oil Change', 'Brake Service'],
    price: '500',
    image: require('../assets/logo.jpg'),
  },
  {
    id: '2',
    name: 'Rashid Mechanic',
    workshopName: null,
    phone: '03007654321',
    location: 'Gulberg, Lahore',
    rating: 4.3,
    services: ['Engine Tuning', 'Suspension Repair'],
    price: '700',
    image: require('../assets/logo.png'),
  },
];

const MechanicCard = ({ mechanic }) => (
  <View style={styles.card}>
    <Image source={mechanic.image} style={styles.image} />
    <View style={styles.info}>
      <Text style={styles.name}>{mechanic.name}</Text>
      {mechanic.workshopName && (
        <Text style={styles.workshop}>{mechanic.workshopName}</Text>
      )}
      <Text style={styles.services}>🛠 {mechanic.services.join(', ')}</Text>
      <Text style={styles.location}>
        <Entypo name="location-pin" size={16} color="gray" /> {mechanic.location}
      </Text>
      <View style={styles.row}>
        <FontAwesome name="star" size={16} color="#FFD700" />
        <Text style={styles.rating}>{mechanic.rating} / 5</Text>
      </View>
      <Text style={styles.price}>Starting from Rs. {mechanic.price}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${mechanic.phone}`)}>
          <MaterialIcons name="call" size={22} color="green" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const MechanicListScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Find a Mechanic</Text>
      <FlatList
        data={mechanics}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MechanicCard mechanic={item} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
};

export default MechanicListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    alignSelf: 'center',
  },
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    paddingLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  workshop: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
  },
  services: {
    fontSize: 13,
    marginTop: 2,
    color: '#555',
  },
  location: {
    fontSize: 13,
    color: 'gray',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 13,
    marginLeft: 5,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    color: '#000',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  bookText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
