import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useStudents } from '../../contexts/StudentContext';
import { StudentMatch } from '../../api/studentApi';
import colors from '../../constants/colors';

interface LinkStudentScreenProps {
  navigation: any;
}

export default function LinkStudentScreen({ navigation }: LinkStudentScreenProps) {
  const { profile } = useAuth();
  const {
    searchResults,
    linkedStudents,
    loadingSearch,
    linkingStudent,
    error,
    searchStudentsAsync,
    linkStudentAsync,
    clearError,
    clearSearchResults,
    fetchLinkedStudentsAsync,
  } = useStudents();

  const [selectedStudent, setSelectedStudent] = useState<StudentMatch | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Filter out already linked students
  const linkedStudentIds = new Set(linkedStudents.map(s => s.id));
  const availableStudents = searchResults.filter(student => !linkedStudentIds.has(student.id));

  useEffect(() => {
    // Fetch linked students first to filter them out
    fetchLinkedStudentsAsync().catch(err => console.error('Failed to fetch students:', err));
  }, []);

  useEffect(() => {
    // Auto-search when component loads
    console.log('🔍 LinkStudentScreen useEffect - profile:', profile);
    if (profile) {
      const parentName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
      const parentEmail = profile.email || '';
      const parentPhone = profile.phone || '';

      console.log('🔍 LinkStudentScreen - parentName:', parentName, 'parentEmail:', parentEmail, 'parentPhone:', parentPhone);

      if (!parentName || !parentEmail) {
        console.log('❌ LinkStudentScreen - Missing required fields:', { parentName, parentEmail });
        Alert.alert(
          'Profile Incomplete',
          'Your profile is missing required information (name or email). Please update your profile first.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        return;
      }

      console.log('🚀 LinkStudentScreen - Searching for students');
      searchStudentsAsync(parentName, parentEmail, parentPhone).catch(err => {
        console.error('Failed to search students:', err);
      });
    } else {
      console.log('❌ LinkStudentScreen - No profile available');
      Alert.alert(
        'Profile Not Found',
        'Unable to load your profile. Please try again.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }

    return () => {
      clearSearchResults();
    };
  }, [profile]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error]);

  const handleStudentSelect = (student: StudentMatch) => {
    setSelectedStudent(student);
    setShowConfirmation(true);
  };

  const handleConfirmLink = async () => {
    if (!selectedStudent) return;

    try {
      await linkStudentAsync(selectedStudent.id);

      Alert.alert(
        'Success!',
        `${selectedStudent.first_name} ${selectedStudent.last_name} has been linked to your account.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowConfirmation(false);
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to link student. Please try again.');
    }
  };

  const handleManualSearch = () => {
    navigation.navigate('ConnectChild');
  };


  const highConfidenceMatches = availableStudents.filter(s => s.match_confidence === 'high');
  const mediumConfidenceMatches = availableStudents.filter(s => s.match_confidence === 'medium');
  const lowConfidenceMatches = availableStudents.filter(s => s.match_confidence === 'low');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}


      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Info Card */}


        {loadingSearch ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Searching for your children...</Text>
          </View>
        ) : (
          <>
            {/* High Confidence Matches */}
            {highConfidenceMatches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Strong Matches</Text>
                {highConfidenceMatches.map((student) => (
                  <StudentMatchCard
                    key={student.id}
                    student={student}
                    onSelect={handleStudentSelect}
                  />
                ))}
              </View>
            )}

            {/* Medium Confidence Matches */}
            {mediumConfidenceMatches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Possible Matches</Text>
                {mediumConfidenceMatches.map((student) => (
                  <StudentMatchCard
                    key={student.id}
                    student={student}
                    onSelect={handleStudentSelect}
                  />
                ))}
              </View>
            )}

            {/* Low Confidence Matches */}
            {lowConfidenceMatches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Other Matches</Text>
                {lowConfidenceMatches.map((student) => (
                  <StudentMatchCard
                    key={student.id}
                    student={student}
                    onSelect={handleStudentSelect}
                  />
                ))}
              </View>
            )}

            {/* No Matches */}
            {availableStudents.length === 0 && (
              <View style={styles.noMatchesContainer}>
                <Text style={styles.noMatchesIcon}>🔍</Text>
                <Text style={styles.noMatchesTitle}>No Automatic Matches Found</Text>
                <Text style={styles.noMatchesSubtitle}>
                  We couldn't find any students that match your information automatically.
                </Text>
                <TouchableOpacity
                  style={styles.manualSearchButton}
                  onPress={handleManualSearch}
                  activeOpacity={0.8}
                >
                  <Text style={styles.manualSearchButtonText}>Search Manually</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Link</Text>
            {selectedStudent && (
              <>
                <Text style={styles.modalStudentName}>
                  {selectedStudent.first_name} {selectedStudent.last_name}
                </Text>
                <Text style={styles.modalStudentDetails}>
                  {selectedStudent.school_name} - Grade {selectedStudent.grade_level}
                </Text>
                <Text style={styles.modalStudentDetails}>
                  Student ID: {selectedStudent.student_id}
                </Text>
                
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowConfirmation(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.confirmButton, linkingStudent && styles.disabledButton]}
                onPress={handleConfirmLink}
                disabled={linkingStudent}
                activeOpacity={0.8}
              >
                {linkingStudent ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.confirmButtonText}>Link Student</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

interface StudentMatchCardProps {
  student: StudentMatch;
  onSelect: (student: StudentMatch) => void;
}

const StudentMatchCard: React.FC<StudentMatchCardProps> = ({
  student,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={styles.studentCard}
      onPress={() => onSelect(student)}
      activeOpacity={0.8}
    >
      <View style={styles.studentCardContent}>
        <View style={styles.studentIconContainer}>
          <Ionicons name="person" size={32} color="#3B82F6" />
        </View>
        
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>
            {student.first_name} {student.last_name}
          </Text>
          <View style={styles.studentDetailsRow}>
            <Ionicons name="school" size={16} color="#B0C4DE" />
            <Text style={styles.studentDetails}>
              {student.school_name}
            </Text>
          </View>
          <View style={styles.studentDetailsRow}>
            <Ionicons name="book" size={16} color="#B0C4DE" />
            <Text style={styles.studentDetails}>
              Grade {student.grade_level}
            </Text>
          </View>
          <View style={styles.studentDetailsRow}>
            <Ionicons name="card" size={16} color="#B0C4DE" />
            <Text style={styles.studentId}>ID: {student.student_id}</Text>
          </View>
        </View>
        
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E3A8A',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#B0C4DE',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  studentCard: {
    backgroundColor: '#1E3A8A',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  studentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2C67A6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  studentDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  studentDetails: {
    fontSize: 14,
    color: '#B0C4DE',
  },
  studentId: {
    fontSize: 14,
    color: '#B0C4DE',
  },
  noMatchesContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  noMatchesIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noMatchesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  noMatchesSubtitle: {
    fontSize: 16,
    color: '#B0C4DE',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  manualSearchButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  manualSearchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalStudentName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalStudentDetails: {
    fontSize: 14,
    color: '#B0C4DE',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2C67A6',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    color: '#B0C4DE',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
