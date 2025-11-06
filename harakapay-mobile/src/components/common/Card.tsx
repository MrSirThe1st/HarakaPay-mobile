import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.card}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground, // Light blue
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginVertical: 8,
  },
});

export default Card;
