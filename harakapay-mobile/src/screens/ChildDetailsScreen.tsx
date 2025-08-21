import { View, Text, StyleSheet } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/types';

type Props = StackScreenProps<RootStackParamList, 'ChildDetails'>;

export default function ChildDetailsScreen({ route }: Props) {
  const { childId, studentName } = route.params;

  // TODO: Fetch and display detailed info about the child (payment history, school info, etc.)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Child Details</Text>
      <Text style={styles.label}>Name: {studentName}</Text>
      <Text style={styles.label}>ID: {childId}</Text>
      {/* Add more details here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0080FF',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
});
