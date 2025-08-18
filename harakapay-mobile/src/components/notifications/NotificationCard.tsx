import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationCard: React.FC<{ message: string }> = ({ message }) => (
  <View style={styles.card}>
    <Text>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default NotificationCard;
