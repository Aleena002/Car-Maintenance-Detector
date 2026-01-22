import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker from the new package

const VerifyNumberScreen = ({ navigation }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [countryCode, setCountryCode] = useState('+1'); // Default country code (can be updated)
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleVerifyCode = () => {
    // Assuming you have logic for sending the OTP (API call or SMS integration)
    // After sending the OTP, navigate to the OTP verification screen
    navigation.navigate('VerifyOtpScreen');  // Navigate to VerifyOtpScreen after sending the code
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.carDetectText}>Car Detected</Text>
      </View>

      {/* Verification Form */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Enter your phone number</Text>
        <Text style={styles.subtitle}>We will send a verification code to your phone number.</Text>

        {/* Country Code Picker */}
        <View style={styles.countryPickerContainer}>
          <Picker
            selectedValue={countryCode}
            style={styles.countryPicker}
            onValueChange={(itemValue) => setCountryCode(itemValue)}
          >
            <Picker.Item label="+1 (USA)" value="+1" />
            <Picker.Item label="+44 (UK)" value="+44" />
            <Picker.Item label="+91 (India)" value="+91" />
            <Picker.Item label="+92 (Pakistan)" value="+92" />
          </Picker>
        </View>

        {/* Phone Number Input */}
        <TextInput
          placeholder="Phone Number"
          style={styles.input}
          keyboardType="number-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        {/* Send Code Button */}
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerifyCode} // Navigate to OTP screen
          disabled={phoneNumber.length < 10} // Disable button until a valid phone number is entered (you can adjust the validation)
        >
          <Text style={styles.verifyTextButton}>Send Code</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  countryPickerContainer: {
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  countryPicker: {
    height: 50,
    width: '100%',
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
  verifyButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'navy',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  verifyTextButton: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerifyNumberScreen;
