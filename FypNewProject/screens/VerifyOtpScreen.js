import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';

const VerifyOtpScreen = ({ navigation }) => {
  const [otp, setOtp] = useState('');

  // Function to handle OTP verification
  const handleVerifyOtp = () => {
    // Assuming the correct OTP is "1234" (replace with actual logic/API call)
    if (otp === '1234') {
      navigation.navigate('Home'); // Navigate to HomeTab on successful OTP verification
    } else {
      alert('Invalid OTP. Please try again.'); // Show error message if OTP is incorrect
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.carDetectText}>Car Detected</Text>
      </View>

      {/* OTP Verification Form */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Enter the OTP</Text>
        <Text style={styles.subtitle}>We have sent an OTP to your registered phone number.</Text>

        {/* OTP Input */}
        <TextInput
          placeholder="Enter OTP"
          style={styles.input}
          keyboardType="number-pad"
          maxLength={4} // Set maxLength to 4 for a 4-digit OTP
          value={otp}
          onChangeText={setOtp}
        />

        {/* Verify Button */}
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerifyOtp}
          disabled={otp.length < 4} // Disable button until the OTP is fully entered
        >
          <Text style={styles.verifyTextButton}>Verify OTP</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>

        {/* Resend OTP Button */}
        <TouchableOpacity style={styles.resendButton} onPress={() => { /* Handle resend logic */ }}>
          <Text style={styles.resendText}>Resend OTP</Text>
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
  orText: {
    color: '#888',
    marginBottom: 10,
    textAlign: 'center',
  },
  resendButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  resendText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerifyOtpScreen;
