// Main navigation for parent app
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/parent/ProfileScreen';
import SettingsScreen from '../screens/parent/SettingsScreen';
import ConnectChildScreen from '../screens/ConnectChildScreen';
import LinkStudentScreen from '../screens/parent/LinkStudentScreen';
import ChildDetailsScreen from '../screens/parent/ChildDetailsScreen';
import FeeDetailsScreen from '../screens/parent/FeeDetailsScreen';
import PaymentPlansScreen from '../screens/parent/PaymentPlansScreen';
import PaymentPlanDetailsScreen from '../screens/parent/PaymentPlanDetailsScreen';
import PaymentsScreen from '../screens/parent/PaymentsScreen';
import PaymentScheduleScreen from '../screens/parent/PaymentScheduleScreen';

const Stack = createStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="ConnectChild" component={ConnectChildScreen} options={{ title: 'Connect Your Child' }} />
    <Stack.Screen name="LinkStudent" component={LinkStudentScreen} options={{ title: 'Link Your Child' }} />
    <Stack.Screen name="ChildDetails" component={ChildDetailsScreen} options={{ title: 'Child Details' }} />
    <Stack.Screen name="FeeDetails" component={FeeDetailsScreen} options={{ title: 'Fee Details' }} />
    <Stack.Screen name="PaymentPlans" component={PaymentPlansScreen} options={{ title: 'Payment Plans' }} />
    <Stack.Screen name="PaymentPlanDetails" component={PaymentPlanDetailsScreen} options={{ title: 'Payment Plan Details' }} />
    <Stack.Screen name="Payments" component={PaymentsScreen} options={{ title: 'Payments' }} />
    <Stack.Screen name="PaymentSchedule" component={PaymentScheduleScreen} options={{ title: 'Payment Options' }} />
  </Stack.Navigator>
);

export default MainNavigator;
