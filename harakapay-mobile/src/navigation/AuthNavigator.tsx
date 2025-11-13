// Auth navigation stack
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
// Quick registration temporarily disabled
// import QuickRegisterScreen from '../screens/auth/QuickRegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import colors from '../constants/colors';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.background, // Very dark blue
        height: 80,
      },
      headerTintColor: colors.text.primary, // White text
      headerTitleStyle: {
        fontWeight: '600',
        fontSize: 18,
      },
      headerTitleAlign: 'center',
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    {/* Quick registration temporarily disabled */}
    {/* <Stack.Screen name="QuickRegister" component={QuickRegisterScreen} options={{ headerShown: false }} /> */}
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Reset Password' }} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'Set New Password' }} />
  </Stack.Navigator>
);

export default AuthNavigator;
