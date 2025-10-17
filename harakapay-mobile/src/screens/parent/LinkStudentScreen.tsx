import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import {
  searchStudentsAsync,
  linkStudentAsync,
  clearError,
  clearSearchResults,
} from '../../store/studentSlice';
import { StudentMatch } from '../../api/studentApi';

interface LinkStudentScreenProps {
  navigation: any;
}

export default function LinkStudentScreen({ navigation }: LinkStudentScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, profile } = useAuth();
  const { searchResults, loadingSearch, linkingStudent, error } = useSelector(
    (state: RootState) => state.student
  );

  const [selectedStudent, setSelectedStudent] = useState<StudentMatch | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Auto-search when component loads
    console.log('🔍 LinkStudentScreen useEffect - user:', user, 'profile:', profile);
    if (profile && user) {
      const parentName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
      const parentEmail = profile.email || user.email || '';
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

      console.log('🚀 LinkStudentScreen - Dispatching searchStudentsAsync');
      dispatch(searchStudentsAsync({
        parentName,
        parentEmail,
        parentPhone,
      }));
    } else {
      console.log('❌ LinkStudentScreen - No profile or user available');
      Alert.alert(
        'Profile Not Found',
        'Unable to load your profile. Please try again.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }

    return () => {
      dispatch(clearSearchResults());
    };
  }, [dispatch, profile, user]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleStudentSelect = (student: StudentMatch) => {
    setSelectedStudent(student);
    setShowConfirmation(true);
  };

  const handleConfirmLink = async () => {
    if (!selectedStudent) return;

    try {
      await dispatch(linkStudentAsync(selectedStudent.id)).unwrap();
      
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

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getConfidenceLabel = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'Strong Match';
      case 'medium':
        return 'Possible Match';
      default:
        return 'Low Match';
    }
  };

  const highConfidenceMatches = searchResults.filter(s => s.match_confidence === 'high');
  const mediumConfidenceMatches = searchResults.filter(s => s.match_confidence === 'medium');
  const lowConfidenceMatches = searchResults.filter(s => s.match_confidence === 'low');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Link Your Child</Text>
          <Text style={styles.subtitle}>
            We found potential matches based on your information
          </Text>
        </View>

        {loadingSearch ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0080FF" />
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
                    confidenceColor={getConfidenceColor(student.match_confidence)}
                    confidenceLabel={getConfidenceLabel(student.match_confidence)}
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
                    confidenceColor={getConfidenceColor(student.match_confidence)}
                    confidenceLabel={getConfidenceLabel(student.match_confidence)}
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
                    confidenceColor={getConfidenceColor(student.match_confidence)}
                    confidenceLabel={getConfidenceLabel(student.match_confidence)}
                  />
                ))}
              </View>
            )}

            {/* No Matches */}
            {searchResults.length === 0 && (
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
                
                <View style={styles.matchReasonsContainer}>
                  <Text style={styles.matchReasonsTitle}>Match Reasons:</Text>
                  {selectedStudent.match_reasons.map((reason, index) => (
                    <Text key={index} style={styles.matchReason}>
                      • {reason}
                    </Text>
                  ))}
                </View>
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
  confidenceColor: string;
  confidenceLabel: string;
}

const StudentMatchCard: React.FC<StudentMatchCardProps> = ({
  student,
  onSelect,
  confidenceColor,
  confidenceLabel,
}) => {
  return (
    <TouchableOpacity
      style={styles.studentCard}
      onPress={() => onSelect(student)}
      activeOpacity={0.8}
    >
      <View style={styles.studentCardHeader}>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>
            {student.first_name} {student.last_name}
          </Text>
          <Text style={styles.studentDetails}>
            {student.school_name} - Grade {student.grade_level}
          </Text>
          <Text style={styles.studentId}>ID: {student.student_id}</Text>
        </View>
        
        <View style={[styles.confidenceBadge, { backgroundColor: confidenceColor }]}>
          <Text style={styles.confidenceText}>{confidenceLabel}</Text>
        </View>
      </View>

      <View style={styles.matchReasons}>
        {student.match_reasons.map((reason, index) => (
          <Text key={index} style={styles.matchReason}>
            ✓ {reason}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
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
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  studentCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  studentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  studentDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  studentId: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  confidenceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  matchReasons: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  matchReason: {
    fontSize: 14,
    color: '#10B981',
    marginBottom: 4,
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
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  noMatchesSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  manualSearchButton: {
    backgroundColor: '#0080FF',
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
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalStudentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalStudentDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  matchReasonsContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  matchReasonsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
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
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#0080FF',
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
