import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [userKey, setUserKey] = useState(null); 
  const [userNumber, setUserNumber] = useState('');


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await AsyncStorage.getItem('user_session');

        if (!session) {
          Alert.alert(
            'Session Expired',
            'Please login first.',
            [
              {
                text: 'Go to Login',
                onPress: () => navigation.replace('Login'),
              },
            ],
            { cancelable: false }
          );
          return;
        }

        const sessionData = JSON.parse(session);
        const response = await fetch(
          'https://carmaintainence-default-rtdb.firebaseio.com/users.json'
        );

        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();

        // Find current user by email
        const foundKey = Object.keys(data).find(
          key => data[key].userEmail === sessionData.userEmail
        );

        if (foundKey) {
          const userData = data[foundKey];
          setUserName(userData.userName || '');
          setEmail(userData.userEmail || '');
          setUserNumber(userData.userNumber || '');
          setUserKey(foundKey);
        }

      } catch (error) {
        console.error('Error loading profile:', error);
        Alert.alert('Error', 'Failed to load profile data.');
      }
    };

    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const session = await AsyncStorage.getItem('user_session');

      if (!session) {
        Alert.alert(
          'Not Logged In',
          'Please login first.',
          [
            {
              text: 'Go to Login',
              onPress: () => navigation.replace('Login'),
            },
          ],
          { cancelable: false }
        );
        return;
      }

      Alert.alert(
        'Confirm Update',
        'Are you sure you want to save these changes?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes, Save',
            onPress: async () => {
              const updatedData = {
                userName: userName,
                userEmail: email,
                userNumber: userNumber,
              };


              if (!userKey) {
                Alert.alert('User not found in database.');
                return;
              }

              await fetch(
                `https://carmaintainence-default-rtdb.firebaseio.com/users/${userKey}.json`,
                {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(updatedData),
                }
              );

              Alert.alert('Success', 'Profile updated successfully!');
              navigation.navigate('Home', {
                updatedProfile: updatedData,
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.carDetectText}>Car Detected</Text>
      </View>

      {/* Profile Form */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Your Profile</Text>

        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={userName}
          onChangeText={setUserName}
        />

        <TextInput
          placeholder="Email Address"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Phone Number"
          style={styles.input}
          keyboardType="phone-pad"
          value={userNumber}
          onChangeText={setUserNumber}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveProfile}
        >
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPassword')}
          style={{
            marginTop: 15,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
            backgroundColor: '#E6F0FF',
            alignSelf: 'center',
          }}
        >
          <Text style={{ color: '#1E3A8A', fontWeight: '600', fontSize: 16 }}>
          🔒 Forgot your password? Reset it here
          </Text>
        </TouchableOpacity>


     </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  carDetectText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'navy',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  saveText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
