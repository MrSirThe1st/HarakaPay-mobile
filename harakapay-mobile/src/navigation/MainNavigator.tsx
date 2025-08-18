// Main navigation for parent app
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/parent/ProfileScreen';
import SettingsScreen from '../screens/parent/SettingsScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

export default MainNavigator;
