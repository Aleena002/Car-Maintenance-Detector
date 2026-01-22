import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 📂 Import screens
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ForgetPassword from './screens/ForgetPassword';
import VerifyEmailScreen from './screens/VerifyEmailScreen';
import VerifyNumberScreen from './screens/VerifyNumberScreen';
import VerifyOtpScreen from './screens/VerifyOtpScreen';
import MoreScreen from './screens/MoreScreen';

import ProfileScreen from './screens/ProfileScreen';
import ScanScreen from './screens/ScanScreen';
import LiveScanScreen from './screens/LiveScanScreen';

import CarInspectionScreen from './screens/CarInspectionScreen';
import CarAlignmentScreen from './screens/CarAlignmentScreen';
import CarAuthenticityScreen from './screens/CarAuthenticityScreen';
import AuthenticityReport from './screens/AuthenticityReport';

import CheckDents from './screens/CheckDents';
import CheckDentReport from './screens/CheckDentReport';
import CheckScratchReport from './screens/CheckScratchReport'; // ✅ Used for both
import Report from './screens/Report';

import MechanicListScreen from './screens/MechanicListScreen';
import MechanicDetailScreen from './screens/MechanicDetailScreen';
import BookingScreen from './screens/BookingScreen';
import BookingConfirmationScreen from './screens/BookingConfirmationScreen';
import MechanicUploadScreen from './screens/MechanicUploadScreen';
import MyBookingsScreen from './screens/MyBookingsScreen';
import BookingDetailsScreen from './screens/BookingDetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {/* 📌 Splash and Auth Screens */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{ headerShown: false }} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VerifyNumberScreen" component={VerifyNumberScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VerifyOtpScreen" component={VerifyOtpScreen} options={{ headerShown: false }} />

        {/* 📌 Main Screens */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MoreScreen" component={MoreScreen} options={{ headerShown: false }} />

        {/* 📌 Scanning Screens */}
        <Stack.Screen name="Scan" component={ScanScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LiveScan" component={LiveScanScreen} options={{ headerShown: false }} />

        {/* 📌 Car Inspection Screens */}
        <Stack.Screen name="CarInspection" component={CarInspectionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CarAlignment" component={CarAlignmentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CarAuthenticity" component={CarAuthenticityScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AuthenticityReport" component={AuthenticityReport} options={{ headerShown: false }} />

        {/* 📌 Damage Detection Screens */}
        <Stack.Screen name="CheckDents" component={CheckDents} options={{ headerShown: false }} />
        <Stack.Screen name="CheckDentReport" component={CheckDentReport} options={{ headerShown: false }} />
        <Stack.Screen name="CheckScratch" component={CheckScratchReport} options={{ headerShown: false }} />
        <Stack.Screen name="CheckScratchReport" component={CheckScratchReport} options={{ headerShown: false }} />
        <Stack.Screen name="Report" component={Report} options={{ headerShown: false }} />

        {/* 📌 Mechanic Booking Screens */}
        <Stack.Screen name="Mechanics" component={MechanicListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MechanicDetail" component={MechanicDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyBookings" component={MyBookingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MechanicUpload" component={MechanicUploadScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
