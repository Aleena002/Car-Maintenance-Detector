import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  Image, Alert, Platform, Switch, ActivityIndicator, Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'; // ✅ NEW IMPORT
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const serviceOptions = ['Oil Change', 'Engine Repair', 'Brake Service', 'AC Repair', 'Tire Change'];

const MechanicUploadScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    workshopName: '',
    phone: '',
    address: '',
    price: '',
  });
  const [imageUri, setImageUri] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [markerLocation, setMarkerLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [email, setEmail] = useState(null);
  const [existingKey, setExistingKey] = useState(null);

useEffect(() => {
  const checkSessionAndFetchMechanic = async () => {
    try {
      const session = await AsyncStorage.getItem('user_session');
      if (!session) {
        Alert.alert("Login Required", "Please login to upload mechanic data.", [
          { text: "OK", onPress: () => navigation.replace("Login") }
        ]);
        return;
      }

      const parsedSession = JSON.parse(session);
      const storedEmail = parsedSession.userEmail;
      const storedName = parsedSession.userName || '';
      const storedNumber = parsedSession.userNumber || '';
      setEmail(storedEmail);

      const res = await fetch('https://carmaintainence-default-rtdb.firebaseio.com/Mechanic.json');
      const data = await res.json();

      if (data) {
        const entry = Object.entries(data).find(([_, value]) => value.email === storedEmail);
        if (entry) {
          const [key, mechanic] = entry;
          setForm({
            name: mechanic.name,
            workshopName: mechanic.workshopName,
            phone: mechanic.phone,
            address: mechanic.address,
            price: mechanic.price,
          });
          setSelectedServices(mechanic.services || []);
          setImageUri(mechanic.image || null);
          setIsDisabled(mechanic.disabled || false);
          setIsActive(mechanic.status === 'Active');
          setExistingKey(key);
          return;
        }
      }

      // ✅ Show confirmation if user wants to create a new mechanic profile
      Alert.alert(
        "No Mechanic Data Found",
        "Are you sure you want to create a new mechanic account with this email?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => navigation.goBack(),
          },
          {
            text: "Yes, Continue",
            onPress: () => {
              setForm((prevForm) => ({
                ...prevForm,
                name: storedName,
                phone: storedNumber,
              }));
            },
          },
        ]
      );
    } catch (err) {
      console.error("Session or Data Error:", err);
    }
  };

  checkSessionAndFetchMechanic();
}, []);


  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

const pickImage = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, 
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const localUri = asset.uri;
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename ?? '');
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append('file', {
        uri: localUri,
        name: filename,
        type,
      });

      const response = await fetch('http://192.168.137.1:3000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      console.log('Upload response:', data);

      if (data.imagePath) {
        setImageUri(`http://192.168.137.1:3000${data.imagePath}`);
      } else {
        Alert.alert('Upload Failed', 'No image path returned from server.');
      }
    }
  } catch (error) {
    console.error('Image Upload Error:', error);
    Alert.alert('Error', 'Failed to upload image. Please try again.');
  }
};

  const openLocationModal = async () => {
    setLoadingLocation(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required.');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setCurrentLocation(location.coords);
    setMarkerLocation(location.coords);
    setLocationModalVisible(true);
    setLoadingLocation(false);
  };

  const confirmLocation = async () => {
    try {
      const [place] = await Location.reverseGeocodeAsync(markerLocation);
      if (place) {
        const address = `${place.name || ''}, ${place.street || ''}, ${place.city || ''}`;
        setForm((prev) => ({ ...prev, address }));
        setLocationModalVisible(false);
      } else {
        Alert.alert('Error', 'Unable to get address.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get address.');
    }
  };

  const handleSubmit = async () => {
    if (
      !form.name || !form.workshopName || !form.phone ||
      !form.address || !form.price || !imageUri || selectedServices.length === 0
    ) {
      Alert.alert('Missing Fields', 'Please fill all fields, select services, and upload a logo.');
      return;
    }

    const mechanicData = {
      ...form,
      email,
      services: selectedServices,
      image: imageUri,
      disabled: isDisabled,
      status: isActive ? 'Active' : 'Inactive',
    };

    try {
      const url = existingKey
        ? `https://carmaintainence-default-rtdb.firebaseio.com/Mechanic/${existingKey}.json`
        : `https://carmaintainence-default-rtdb.firebaseio.com/Mechanic.json`;

      const method = existingKey ? 'PATCH' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mechanicData),
      });

      Alert.alert(
        existingKey ? 'Updated' : 'Success',
        existingKey ? 'Mechanic information updated.' : 'Mechanic uploaded successfully!',
        [
            {
            text: 'OK',
            onPress: () => navigation.replace('MechanicUpload'),
            },
        ]
        );

    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.carDetectText}>Car Detected</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Mechanic Information</Text>

        <TouchableOpacity style={styles.imageFrame} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.imageText}>Tap to Upload Logo</Text>
          )}
        </TouchableOpacity>

        <View style={styles.row}>
          <TextInput
            placeholder="Mechanic Name"
            value={form.name}
            onChangeText={(v) => handleChange('name', v)}
            style={[styles.input, styles.halfInput]}
          />
          <TextInput
            placeholder="Workshop Name"
            value={form.workshopName}
            onChangeText={(v) => handleChange('workshopName', v)}
            style={[styles.input, styles.halfInput]}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            placeholder="Phone Number"
            value={form.phone}
            onChangeText={(v) => handleChange('phone', v)}
            style={[styles.input, styles.halfInput]}
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="Starting Price"
            value={form.price}
            onChangeText={(v) => handleChange('price', v)}
            style={[styles.input, styles.halfInput]}
            keyboardType="numeric"
          />
        </View>

        <TextInput
          placeholder="Address"
          value={form.address}
          onChangeText={(v) => handleChange('address', v)}
          style={styles.addressBox}
          multiline
        />

        <TouchableOpacity style={styles.locationButton} onPress={openLocationModal}>
          {loadingLocation ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.locationButtonText}>Select by Live Location</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Select Services:</Text>
        <View style={styles.serviceContainer}>
          {serviceOptions.map((service) => (
            <TouchableOpacity
              key={service}
              onPress={() => toggleService(service)}
              style={[
                styles.servicePill,
                selectedServices.includes(service) && styles.selectedPill,
              ]}
            >
              <Text
                style={[
                  styles.serviceText,
                  selectedServices.includes(service) && styles.selectedText,
                ]}
              >
                {service}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>I Don't Have Workshop</Text>
          <Switch
            value={isDisabled}
            onValueChange={setIsDisabled}
            trackColor={{ false: '#ccc', true: 'navy' }}
            thumbColor={Platform.OS === 'android' ? (isDisabled ? '#fff' : '#f4f3f4') : undefined}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Status: {isActive ? 'Active' : 'Inactive'}</Text>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ false: '#ccc', true: 'navy' }}
            thumbColor={Platform.OS === 'android' ? (isActive ? '#fff' : '#f4f3f4') : undefined}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate('MoreScreen')}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>
              {existingKey ? 'Update Information' : 'Save Information'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Location Modal */}
      <Modal visible={locationModalVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          {currentLocation && (
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPress={(e) => setMarkerLocation(e.nativeEvent.coordinate)}
            >
              {markerLocation && <Marker coordinate={markerLocation} />}
            </MapView>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 15, backgroundColor: '#fff' }}>
            <TouchableOpacity onPress={() => setLocationModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmLocation} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
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
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 80,
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: { width: 60, height: 60, resizeMode: 'contain' },
  carDetectText: { marginLeft: 10, fontSize: 18, fontWeight: 'bold' },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: Platform.OS === 'ios' ? 15 : 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  halfInput: {
    width: '48%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  imageFrame: {
    width: 160,
    height: 160,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
},
buttonRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 10,
},
submitButton: {
  backgroundColor: 'navy',
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 12,
  flex: 1,
  marginRight: 5,
},
cancelButton: {
  backgroundColor: '#c20a0aff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
    elevation: 2,
},

cancelText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},

  image: {
    width: '100%',
    height: '100%',
  },
  imageText: {
    fontSize: 14,
    color: '#777',
  },
    addressBox: {
    height: 100,
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 15,
    },
  locationButton: {
    backgroundColor: 'navy',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  serviceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'flex-start',
  },
  servicePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 8,
    marginBottom: 10,
    backgroundColor: '#f1f1f1',
  },
  selectedPill: {
    backgroundColor: 'navy',
    borderColor: '#1505f6ff',
  },
  serviceText: {
    fontSize: 14,
    color: '#444',
  },
  selectedText: {
    color: '#fff',
  },
  switchRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  submitButton: {
    backgroundColor: 'navy',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
    marginLeft :10,
    elevation: 2,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButton: {
    backgroundColor: 'navy',
    borderRadius: 10,
    padding: 12,
    width: 120,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
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
});
export default MechanicUploadScreen;