// Bottom tab navigation
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/parent/DashboardScreen';
import ChildrenScreen from '../screens/parent/ChildrenScreen';
import PaymentsScreen from '../screens/parent/PaymentsScreen';
import PaymentHistoryScreen from '../screens/parent/PaymentHistoryScreen';
import NotificationsScreen from '../screens/parent/NotificationsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Children" component={ChildrenScreen} />
    <Tab.Screen name="Payments" component={PaymentsScreen} />
    <Tab.Screen name="History" component={PaymentHistoryScreen} />
    <Tab.Screen name="Notifications" component={NotificationsScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
