import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/colors';
import NotificationsTab from '../../components/NotificationsTab';

const NotificationsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <NotificationsTab />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default NotificationsScreen;
