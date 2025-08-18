import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const LoadingSpinner: React.FC = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#007bff" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingSpinner;
