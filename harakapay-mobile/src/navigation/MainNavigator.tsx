// Main navigation for parent app
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/parent/ProfileScreen';
import SettingsScreen from '../screens/parent/SettingsScreen';
import ConnectChildScreen from '../screens/ConnectChildScreen';
import LinkStudentScreen from '../screens/parent/LinkStudentScreen';
import ChildDetailsScreen from '../screens/parent/ChildDetailsScreen';

const Stack = createStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="ConnectChild" component={ConnectChildScreen} options={{ title: 'Connect Your Child' }} />
    <Stack.Screen name="LinkStudent" component={LinkStudentScreen} options={{ title: 'Link Your Child' }} />
    <Stack.Screen name="ChildDetails" component={ChildDetailsScreen} options={{ title: 'Child Details' }} />
  </Stack.Navigator>
);

export default MainNavigator;
