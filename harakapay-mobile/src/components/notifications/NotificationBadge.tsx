import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationBadge: React.FC<{ count: number }> = ({ count }) => (
  <View style={styles.badge}>
    <Text style={styles.text}>{count}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default NotificationBadge;
