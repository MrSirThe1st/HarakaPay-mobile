import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../hooks/useAuth';



const DashboardScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { parent } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {/* Show parent info if available */}
      {parent && (
        <View style={styles.parentInfoCard}>
          <Text style={styles.parentInfoText}>Welcome, {parent.first_name} {parent.last_name}</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.addChildButton}
        onPress={() => navigation && navigation.navigate('ConnectChild')}
      >
        <Text style={styles.addChildText}>+ Connect Child</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  parentInfoCard: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  parentInfoText: {
    fontSize: 16,
    color: '#15803D',
    fontWeight: '600',
  },
  addChildButton: {
    backgroundColor: '#0080FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  addChildText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
