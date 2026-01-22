import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';

const MechanicDetailScreen = ({ route, navigation }) => {
  const mechanic = route.params.mechanic;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: mechanic.image }} style={styles.mainImage} />

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{mechanic.name}</Text>

        {mechanic.workshopName && (
          <Text style={styles.workshop}>{mechanic.workshopName}</Text>
        )}

        <View style={styles.ratingRow}>
          <FontAwesome name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}> {mechanic.rating}4.5 / 5</Text>
        </View>

        <Text style={styles.sectionTitle}>Services Offered:</Text>
        {mechanic.services.map((service, index) => (
          <Text key={index} style={styles.serviceItem}>
            • {service}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>Starting Price:</Text>
        <Text style={styles.price}>Rs. {mechanic.price}</Text>

        <Text style={styles.sectionTitle}>Location:</Text>
        <Text style={styles.location}>
          <Entypo name="location-pin" size={16} color="gray" />
          {mechanic.address}
        </Text>

        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => Linking.openURL(`tel:${mechanic.phone}`)}
        >
          <FontAwesome name="phone" size={20} color="white" />
          <Text style={styles.callText}> Call Mechanic</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => navigation.navigate('Booking', { mechanic })}
        >
          <Text style={styles.bookText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MechanicDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  mainImage: {
    marginTop:40,
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  workshop: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  ratingText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 12,
    fontWeight: 'bold',
  },
  serviceItem: {
    fontSize: 14,
    marginLeft: 10,
    color: '#444',
  },
  price: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  callBtn: {
    flexDirection: 'row',
    backgroundColor: 'green',
    padding: 10,
    marginTop: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callText: {
    color: 'white',
    fontSize: 16,
  },
  bookBtn: {
    backgroundColor: 'navy',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    alignItems: 'center',
  },
  bookText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
