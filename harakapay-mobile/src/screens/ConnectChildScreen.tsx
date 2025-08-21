// harakapay-mobile/src/screens/ConnectChildScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { supabase } from '../config/supabase';
import { useAuth } from '../hooks/useAuth';

const { width } = Dimensions.get('window');

interface School {
  id: string;
  name: string;
  address: string | null;
  contact_phone: string | null;
}

interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  grade_level: string | null;
  school_id: string;
  parent_name: string | null;
  parent_phone: string | null;
  parent_email: string | null;
}

interface ConnectChildScreenProps {
  navigation: any;
}

export default function ConnectChildScreen({ navigation }: ConnectChildScreenProps) {
  const { parent } = useAuth();
  
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: School Selection
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // Step 2: Grade Selection
  const [grades, setGrades] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('');

  // Step 3: Student Search
  const [students, setStudents] = useState<Student[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Step 4: Verification
  const [verificationResult, setVerificationResult] = useState<'pending' | 'match' | 'no_match'>('pending');

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('status', 'approved')
        .order('name');

      if (error) throw error;
      setSchools(data || []);
    } catch (error) {
      console.error('Error loading schools:', error);
      Alert.alert('Error', 'Failed to load schools. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadGrades = async (schoolId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('grade_level')
        .eq('school_id', schoolId)
        .eq('status', 'active')
        .not('grade_level', 'is', null);

      if (error) throw error;

      const uniqueGrades = [...new Set(data.map(s => s.grade_level))].filter(Boolean).sort();
      setGrades(uniqueGrades);
    } catch (error) {
      console.error('Error loading grades:', error);
      Alert.alert('Error', 'Failed to load grades. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async (schoolId: string, grade: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('school_id', schoolId)
        .eq('grade_level', grade)
        .eq('status', 'active')
        .order('first_name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
      Alert.alert('Error', 'Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyParentMatch = (student: Student) => {
    if (!parent) return false;

    const parentFullName = `${parent.first_name} ${parent.last_name}`.toLowerCase();
    const studentParentName = student.parent_name?.toLowerCase() || '';
    const parentPhone = parent.phone || '';
    const studentParentPhone = student.parent_phone || '';
    const parentEmail = parent.email?.toLowerCase() || '';
    const studentParentEmail = student.parent_email?.toLowerCase() || '';

    // Check if any of the parent details match
    const nameMatch = studentParentName.includes(parent.first_name.toLowerCase()) || 
                     studentParentName.includes(parent.last_name.toLowerCase()) ||
                     parentFullName.includes(studentParentName.split(' ')[0]);
    
    const phoneMatch = parentPhone && studentParentPhone && 
                      (parentPhone === studentParentPhone || 
                       parentPhone.replace(/[^\d]/g, '').slice(-9) === studentParentPhone.replace(/[^\d]/g, '').slice(-9));
    
    const emailMatch = parentEmail && studentParentEmail && parentEmail === studentParentEmail;

    return nameMatch || phoneMatch || emailMatch;
  };

  const handleSchoolSelect = async (school: School) => {
    setSelectedSchool(school);
    setCurrentStep(2);
    await loadGrades(school.id);
  };

  const handleGradeSelect = async (grade: string) => {
    setSelectedGrade(grade);
    setCurrentStep(3);
    if (selectedSchool) {
      await loadStudents(selectedSchool.id, grade);
    }
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    const isMatch = verifyParentMatch(student);
    setVerificationResult(isMatch ? 'match' : 'no_match');
    setCurrentStep(4);
  };

  const createConnection = async () => {
  if (!selectedStudent || !parent) return;

  try {
    setLoading(true);

    // Check if connection already exists
    const { data: existingConnection } = await supabase
      .from('parent_students')
      .select('id')
      .eq('parent_id', parent.id)
      .eq('student_id', selectedStudent.id) // ✅ Use selectedStudent.id (UUID), not selectedStudent.student_id (string)
      .single();

    if (existingConnection) {
      Alert.alert('Already Connected', 'This child is already connected to your account.');
      return;
    }

    console.log('🔗 Creating connection...');
    console.log('📋 Parent ID:', parent.id);
    console.log('📋 Student ID (UUID):', selectedStudent.id); // ✅ This should be the UUID
    console.log('📋 Student ID (String):', selectedStudent.student_id); // ❌ This is the human-readable ID

    // Create the connection - USE selectedStudent.id (the UUID)
    const { error } = await supabase
      .from('parent_students')
      .insert({
        parent_id: parent.id,
        student_id: selectedStudent.id, // ✅ FIXED: Use the UUID, not the student_id string
        relationship_type: 'parent',
        is_primary: true,
        can_make_payments: true,
        can_receive_notifications: true,
      });

    if (error) throw error;

    Alert.alert(
      'Success!', 
      `${selectedStudent.first_name} has been connected to your account.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );

  } catch (error) {
    console.error('Error creating connection:', error);
    Alert.alert('Error', 'Failed to connect child. Please try again or contact your school.');
  } finally {
    setLoading(false);
  }
};

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 2) {
        setSelectedSchool(null);
        setGrades([]);
      } else if (currentStep === 3) {
        setSelectedGrade('');
        setStudents([]);
      } else if (currentStep === 4) {
        setSelectedStudent(null);
        setVerificationResult('pending');
      }
    }
  };

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const filteredStudents = students.filter(student =>
    `${student.first_name} ${student.last_name}`.toLowerCase()
      .includes(studentSearch.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            {[1, 2, 3, 4].map((step) => (
              <View
                key={step}
                style={[
                  styles.progressStep,
                  { backgroundColor: step <= currentStep ? '#0080FF' : '#E5E7EB' }
                ]}
              />
            ))}
          </View>
          <Text style={styles.progressText}>Step {currentStep} of 4</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Connect Your Child</Text>
          <Text style={styles.subtitle}>
            {currentStep === 1 && "Select your child's school"}
            {currentStep === 2 && "Select your child's grade"}
            {currentStep === 3 && "Find your child"}
            {currentStep === 4 && "Verify connection"}
          </Text>
        </View>

        {/* Step 1: School Selection */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for your child's school..."
              value={schoolSearch}
              onChangeText={setSchoolSearch}
              placeholderTextColor="#9CA3AF"
            />
            
            {loading ? (
              <ActivityIndicator size="large" color="#0080FF" style={styles.loader} />
            ) : (
              <View style={styles.listContainer}>
                {filteredSchools.map((school) => (
                  <TouchableOpacity
                    key={school.id}
                    style={styles.listItem}
                    onPress={() => handleSchoolSelect(school)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.listItemTitle}>{school.name}</Text>
                    {school.address && (
                      <Text style={styles.listItemSubtitle}>{school.address}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Step 2: Grade Selection */}
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <View style={styles.schoolInfoCard}>
              <Text style={styles.schoolInfoText}>
                School: {selectedSchool?.name}
              </Text>
            </View>
            
            {loading ? (
              <ActivityIndicator size="large" color="#0080FF" style={styles.loader} />
            ) : (
              <View style={styles.gradeGrid}>
                {grades.map((grade) => (
                  <TouchableOpacity
                    key={grade}
                    style={styles.gradeButton}
                    onPress={() => handleGradeSelect(grade)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.gradeButtonText}>{grade}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Text style={styles.backButtonText}>← Back to Schools</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Student Search */}
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <View style={styles.schoolInfoCard}>
              <Text style={styles.schoolInfoText}>
                {selectedSchool?.name} - Grade {selectedGrade}
              </Text>
            </View>
            
            <TextInput
              style={styles.searchInput}
              placeholder="Search for your child's name..."
              value={studentSearch}
              onChangeText={setStudentSearch}
              placeholderTextColor="#9CA3AF"
            />
            
            {loading ? (
              <ActivityIndicator size="large" color="#0080FF" style={styles.loader} />
            ) : (
              <View style={styles.listContainer}>
                {filteredStudents.map((student) => (
                  <TouchableOpacity
                    key={student.id}
                    style={styles.listItem}
                    onPress={() => handleStudentSelect(student)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.listItemTitle}>
                      {student.first_name} {student.last_name}
                    </Text>
                    <Text style={styles.listItemSubtitle}>
                      Student ID: {student.student_id}
                    </Text>
                  </TouchableOpacity>
                ))}
                {filteredStudents.length === 0 && (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                      No students found. Try adjusting your search.
                    </Text>
                  </View>
                )}
              </View>
            )}
            
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Text style={styles.backButtonText}>← Back to Grades</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 4: Verification */}
        {currentStep === 4 && selectedStudent && (
          <View style={styles.stepContainer}>
            <View style={styles.verificationCard}>
              <Text style={styles.studentName}>
                {selectedStudent.first_name} {selectedStudent.last_name}
              </Text>
              <Text style={styles.studentDetails}>
                {selectedSchool?.name} - Grade {selectedGrade}
              </Text>
              <Text style={styles.studentDetails}>
                Student ID: {selectedStudent.student_id}
              </Text>
            </View>

            {verificationResult === 'match' ? (
              <View style={styles.matchContainer}>
                <Text style={styles.matchIcon}>✅</Text>
                <Text style={styles.matchText}>Verification Successful</Text>
                <Text style={styles.matchSubtext}>
                  Your details match our records for this student.
                </Text>
                
                <TouchableOpacity
                  style={[styles.connectButton, loading && styles.disabledButton]}
                  onPress={createConnection}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.connectButtonText}>Connect This Child</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.noMatchContainer}>
                <Text style={styles.noMatchIcon}>⚠️</Text>
                <Text style={styles.noMatchText}>Verification Required</Text>
                <Text style={styles.noMatchSubtext}>
                  We couldn't automatically verify your connection to this student. 
                  Please contact the school to update your information or verify your details.
                </Text>
                
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => 
                    Alert.alert(
                      'Contact School', 
                      `Please contact ${selectedSchool?.name} to verify your connection to ${selectedStudent.first_name}.`
                    )
                  }
                  activeOpacity={0.8}
                >
                  <Text style={styles.contactButtonText}>Contact School</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Text style={styles.backButtonText}>← Back to Students</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressStep: {
    width: '22%',
    height: 4,
    borderRadius: 2,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  stepContainer: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    marginBottom: 16,
    color: '#1F2937',
  },
  loader: {
    marginTop: 32,
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  schoolInfoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  schoolInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  gradeButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: (width - 44) / 2, // Two columns with padding and gap
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  gradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  verificationCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  studentDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  matchContainer: {
    backgroundColor: '#F0FDF4',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 24,
    alignItems: 'center',
  },
  matchIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  matchText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15803D',
    marginBottom: 8,
  },
  matchSubtext: {
    fontSize: 14,
    color: '#166534',
    textAlign: 'center',
    marginBottom: 20,
  },
  connectButton: {
    backgroundColor: '#0080FF',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noMatchContainer: {
    backgroundColor: '#FEF3C7',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 24,
    alignItems: 'center',
  },
  noMatchIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  noMatchText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D97706',
    marginBottom: 8,
  },
  noMatchSubtext: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 20,
  },
  contactButton: {
    backgroundColor: '#D97706',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    padding: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#0080FF',
    fontWeight: '600',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});