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
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { fetchLinkedStudentsAsync } from '../../store/studentSlice';
import { ChildCard } from '../../components/home/ChildCard';
import { EmptyState } from '../../components/home/EmptyState';
import { LinkedStudent } from '../../api/studentApi';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, profile, loading: authLoading } = useAuth();
  const { linkedStudents, loadingStudents, error } = useSelector(
    (state: RootState) => state.student
  );

  useEffect(() => {
    // Fetch linked students when component mounts
    console.log('🔍 DashboardScreen useEffect - profile:', !!profile, 'authLoading:', authLoading);
    if (profile && !authLoading) {
      console.log('🚀 Dispatching fetchLinkedStudentsAsync');
      dispatch(fetchLinkedStudentsAsync());
    }
  }, [dispatch, profile, authLoading]);

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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {profile?.first_name}!</Text>
            <Text style={styles.subtitle}>Manage your children's school activities</Text>
          </View>
        </View>

        {/* Children Carousel */}
        <View style={styles.carouselSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Children</Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={handleLinkStudent}
              activeOpacity={0.8}
            >
              <Text style={styles.linkButtonText}>+ Link Child</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            style={styles.carousel}
          >
            {linkedStudents.map((student: LinkedStudent) => (
              <ChildCard
                key={student.id}
                student={student}
                onPress={() => handleChildPress(student)}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  carouselSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  linkButton: {
    backgroundColor: '#0080FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  linkButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  carousel: {
    paddingLeft: 20,
  },
  carouselContent: {
    paddingRight: 20,
  },
});

export default HomeScreen;
