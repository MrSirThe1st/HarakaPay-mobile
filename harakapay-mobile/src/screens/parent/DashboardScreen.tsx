import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useStudents } from '../../contexts/StudentContext';
import { ChildCard } from '../../components/home/ChildCard';
import { EmptyState } from '../../components/home/EmptyState';
import { LinkedStudent } from '../../api/studentApi';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { profile, loading: authLoading } = useAuth();
  const { linkedStudents, loadingStudents, error, fetchLinkedStudentsAsync } = useStudents();

  useEffect(() => {
    // Fetch linked students when component mounts
    console.log('🔍 DashboardScreen useEffect - profile:', !!profile, 'authLoading:', authLoading);
    if (profile && !authLoading) {
      console.log('🚀 Fetching linked students');
      fetchLinkedStudentsAsync().catch(err => {
        console.error('Failed to fetch students:', err);
      });
    }
  }, [profile, authLoading]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleLinkStudent = () => {
    navigation?.navigate('LinkStudent');
  };

  const handleChildPress = (student: LinkedStudent) => {
    // Navigate to fee details screen with student data
    navigation?.navigate('FeeDetails', { student });
  };

  if (authLoading || loadingStudents) {
    console.log('⏳ Loading state - authLoading:', authLoading, 'loadingStudents:', loadingStudents);
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0080FF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Show empty state if no children are linked
  if (linkedStudents.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState onLinkStudent={handleLinkStudent} />
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {profile?.first_name}!</Text>
            <Text style={styles.subtitle}>Manage your children's school activities</Text>
          </View>
        </View>

        {/* Children List */}
        <View style={styles.childrenSection}>
          <View style={styles.sectionHeader}>
            <TouchableOpacity
              style={styles.linkButtonContainer}
              onPress={handleLinkStudent}
              activeOpacity={0.8}
            >
              <View style={styles.linkButton}>
                <Ionicons name="add" size={32} color="white" />
              </View>
              <Text style={styles.linkButtonLabel}>Add Child</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.childrenList}>
            {linkedStudents.map((student: LinkedStudent, index: number) => (
              <ChildCard
                key={student.id}
                student={student}
                onPress={() => handleChildPress(student)}
                variant={index % 5} // Cycle through variants
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary, // White text
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary, // Light gray-blue
  },
  childrenSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary, // White text
  },
  linkButtonContainer: {
    alignItems: 'center',
  },
  linkButton: {
    backgroundColor: '#2C67A6', // #0080FF
    width: 64,
    height: 64,
    borderRadius: 32, // Half of width/height for perfect circle
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 8,
  },
  linkButtonLabel: {
    color: colors.text.secondary,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  childrenList: {
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
