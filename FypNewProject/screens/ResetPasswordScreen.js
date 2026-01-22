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
import { FontAwesome } from '@expo/vector-icons';

const ResetPasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userKey, setUserKey] = useState(null);
  const [actualOldPassword, setActualOldPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchUserPassword = async () => {
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
        setActualOldPassword(data[foundKey].userPassword || '');
      } else {
        Alert.alert('Error', 'User not found.');
      }
    };

    fetchUserPassword();
  }, []);

  const handleChangePassword = async () => {
    if (oldPassword !== actualOldPassword) {
      Alert.alert('Error', 'Old password is incorrect.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    try {
      await fetch(
        `https://carmaintainence-default-rtdb.firebaseio.com/users/${userKey}.json`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userPassword: newPassword }),
        }
      );

      Alert.alert('Success', 'Password updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update password.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      {/* Old Password Field */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Enter Old Password"
          secureTextEntry={!showOld}
          style={styles.passwordInput}
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TouchableOpacity
          onPress={() => setShowOld(!showOld)}
          style={styles.eyeIcon}
        >
          <FontAwesome name={showOld ? 'eye' : 'eye-slash'} size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* New Password Field */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Enter New Password"
          secureTextEntry={!showNew}
          style={styles.passwordInput}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity
          onPress={() => setShowNew(!showNew)}
          style={styles.eyeIcon}
        >
          <FontAwesome name={showNew ? 'eye' : 'eye-slash'} size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Confirm New Password Field */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm New Password"
          secureTextEntry={!showConfirm}
          style={styles.passwordInput}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirm(!showConfirm)}
          style={styles.eyeIcon}
        >
          <FontAwesome name={showConfirm ? 'eye' : 'eye-slash'} size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    paddingRight: 10,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
  },
  eyeIcon: {
    padding: 5,
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
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
