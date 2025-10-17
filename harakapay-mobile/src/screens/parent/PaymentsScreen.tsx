import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PaymentsScreen: React.FC = () => (
  <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Payments</Text>
  </SafeAreaView>
);

export default PaymentsScreen;
