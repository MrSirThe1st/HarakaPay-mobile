import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.card}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginVertical: 8,
  },
});

export default Card;
