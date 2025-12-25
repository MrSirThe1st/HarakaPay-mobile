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
import { useI18n } from '../../hooks/useI18n';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { profile, loading: authLoading } = useAuth();
  const { linkedStudents, loadingStudents, error, fetchLinkedStudentsAsync } = useStudents();
  const { t } = useI18n('dashboard');

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
        <ActivityIndicator size="large" color={colors.primary} style={{ transform: [{ scale: 2 }] }} />
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
            <Text style={styles.greeting}>{t('greeting', { name: profile?.first_name })}</Text>
            <Text style={styles.subtitle}>{t('subtitle')}</Text>
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
              <Text style={styles.linkButtonLabel}>{t('addChild')}</Text>
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
    backgroundColor: colors.accent,
    width: 64,
    height: 64,
    borderRadius: 32, // Half of width/height for perfect circle
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
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
