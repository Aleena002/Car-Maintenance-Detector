import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ForgetPasswordFromProfile = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userKey, setUserKey] = useState(null);

  useEffect(() => {
    const getUserKey = async () => {
      try {
        const session = await AsyncStorage.getItem('user_session');
        if (!session) {
          Alert.alert('Session Expired', 'Please login again.', [
            { text: 'Go to Login', onPress: () => navigation.replace('Login') },
          ]);
          return;
        }

        const sessionData = JSON.parse(session);
        const response = await fetch(
          'https://carmaintainence-default-rtdb.firebaseio.com/users.json'
        );
        const data = await response.json();

        const foundKey = Object.keys(data).find(
          key => data[key].userEmail === sessionData.userEmail
        );

        if (foundKey) {
          setUserKey(foundKey);
        } else {
          Alert.alert('User not found in database.');
        }
      } catch (err) {
        console.error('Error fetching user key:', err);
        Alert.alert('Error', 'Failed to verify user.');
      }
    };

    getUserKey();
  }, []);

  const handlePasswordUpdate = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (!userKey) {
      Alert.alert('Error', 'User not found.');
      return;
    }

    try {
      await fetch(
        `https://carmaintainence-default-rtdb.firebaseio.com/users/${userKey}.json`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userPassword: newPassword }),
        }
      );

      Alert.alert('Success', 'Password updated successfully.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Password update failed:', error);
      Alert.alert('Error', 'Failed to update password.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔒 Reset Password</Text>

      <TextInput
        placeholder="New Password"
        secureTextEntry
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handlePasswordUpdate}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ForgetPasswordFromProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: 'navy',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
