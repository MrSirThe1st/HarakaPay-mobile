import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationsScreen: React.FC = () => (
  <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Notifications</Text>
  </SafeAreaView>
);

export default NotificationsScreen;
