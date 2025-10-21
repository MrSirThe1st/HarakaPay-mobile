import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../config/supabase';
import { lookupStudentByNumber, linkStudentsBatch } from '../../services/studentService';
import { StudentLookupResult, StudentToLink } from '../../types/student';
import { useDispatch } from 'react-redux';
import { addLinkedStudent } from '../../store/studentSlice';
import { WEB_API_URL } from '../../config/env';

const { width, height } = Dimensions.get('window');

interface School {
  id: string;
  name: string;
}

interface AddedStudent {
  school_id: string;
  school_name: string;
  student_id: string;
  student_name: string;
  grade_level: string | null;
}

interface QuickRegisterScreenProps {
  navigation: any;
}

const QuickRegisterScreen: React.FC<QuickRegisterScreenProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verifyingStudent, setVerifyingStudent] = useState(false);

  // Step 1: Student Information
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [studentId, setStudentId] = useState('');
  const [studentLookupResult, setStudentLookupResult] = useState<StudentLookupResult | null>(null);
  const [addedStudents, setAddedStudents] = useState<AddedStudent[]>([]);

  // Step 2: Password and Review
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Extracted parent information from student records
  const [parentInfo, setParentInfo] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null>(null);

  const { signUp, signIn, loading: authLoading, error: authError, user, initialized } = useAuth();
  const dispatch = useDispatch();

  // Note: Navigation is handled by RootNavigation based on auth state
  // No manual navigation needed here

  // Load schools on component mount
  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      console.log('🔍 Loading schools...');
      
      const { data, error } = await supabase
        .from('schools')
        .select('id, name')
        .eq('status', 'approved')
        .order('name');

      if (error) {
        console.error('❌ Schools query error:', error);
        throw error;
      }
      
      console.log('✅ Schools loaded:', data?.length || 0);
      setSchools(data || []);
    } catch (error) {
      console.error('💥 Error loading schools:', error);
      Alert.alert(
        'Error', 
        'Failed to load schools. Please try again or contact support.',
        [{ text: 'OK' }]
      );
    }
  };

  // Validation functions

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Le mot de passe est obligatoire');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError('Le mot de passe doit contenir une majuscule, une minuscule et un chiffre');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPass: string): boolean => {
    if (!confirmPass) {
      setConfirmPasswordError('Veuillez confirmer votre mot de passe');
      return false;
    }
    if (confirmPass !== password) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const verifyStudent = async () => {
    if (!selectedSchool || !studentId.trim()) {
      Alert.alert('Erreur', 'Veuillez sélectionner une école et entrer un numéro d\'étudiant');
      return;
    }

    try {
      setVerifyingStudent(true);
      setStudentLookupResult(null);

      const result = await lookupStudentByNumber(selectedSchool.id, studentId.trim());

      if (result.found && result.student) {
        setStudentLookupResult(result);
      } else {
        Alert.alert('Étudiant non trouvé', result.error || 'Aucun étudiant trouvé avec ce numéro');
      }
    } catch (error) {
      console.error('Error verifying student:', error);
      Alert.alert('Erreur', 'Impossible de vérifier l\'étudiant. Veuillez réessayer.');
    } finally {
      setVerifyingStudent(false);
    }
  };

  const addStudent = () => {
    if (!studentLookupResult?.found || !studentLookupResult.student) {
      Alert.alert('Erreur', 'Veuillez d\'abord vérifier l\'étudiant');
      return;
    }

    const student = studentLookupResult.student;
    
    // Check if student is already added
    const isAlreadyAdded = addedStudents.some(
      s => s.school_id === student.school_id && s.student_id === student.student_id
    );

    if (isAlreadyAdded) {
      Alert.alert('Erreur', 'Cet étudiant a déjà été ajouté');
      return;
    }

    const newStudent: AddedStudent = {
      school_id: student.school_id,
      school_name: student.school_name,
      student_id: student.student_id,
      student_name: `${student.first_name} ${student.last_name}`,
      grade_level: student.grade_level,
    };

    setAddedStudents(prev => [...prev, newStudent]);
    
    // Extract parent information from the first student added
    if (addedStudents.length === 0 && student.parent_name && student.parent_email) {
      const parentNameParts = student.parent_name.split(' ');
      const firstName = parentNameParts[0] || '';
      const lastName = parentNameParts.slice(1).join(' ') || '';
      
      setParentInfo({
        firstName,
        lastName,
        email: student.parent_email,
        phone: student.parent_phone || ''
      });
    }
    
    // Reset form
    setStudentId('');
    setStudentLookupResult(null);
    setSelectedSchool(null);

    Alert.alert('Succès', `${student.first_name} ${student.last_name} a été ajouté`);
  };

  const removeStudent = (index: number) => {
    setAddedStudents(prev => prev.filter((_, i) => i !== index));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (addedStudents.length === 0) {
        Alert.alert('Erreur', 'Veuillez ajouter au moins un étudiant');
        return;
      }
      if (!parentInfo) {
        Alert.alert('Erreur', 'Informations parent manquantes dans les données étudiant');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate password
      const isPasswordValid = validatePassword(password);
      const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

      if (!isPasswordValid || !isConfirmPasswordValid) {
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    console.log('🚀 Starting registration process...');
    console.log('📋 Added students:', addedStudents);
    console.log('👤 Parent info:', parentInfo);
    
    if (addedStudents.length === 0) {
      console.log('❌ No students added');
      Alert.alert('Erreur', 'Veuillez ajouter au moins un étudiant');
      return;
    }

    if (!parentInfo) {
      console.log('❌ No parent info');
      Alert.alert('Erreur', 'Informations parent manquantes');
      return;
    }

    try {
      setLoading(true);
      console.log('⏳ Loading state set to true');

      // Step 1: Create Supabase auth account using Redux action
      console.log('🔄 Creating auth account...');
      console.log('📧 Email:', parentInfo.email.toLowerCase().trim());
      console.log('👤 Name:', parentInfo.firstName, parentInfo.lastName);
      
      let authResult = await signUp(
        parentInfo.email.toLowerCase().trim(),
        password,
        parentInfo.firstName,
        parentInfo.lastName,
        parentInfo.phone || ''
      );

      console.log('🔍 Auth result:', authResult);

      // If signup fails because user already exists, show error and stop
      if (!authResult.success && authResult.error === 'User already registered') {
        console.log('❌ User already exists with different password');
        Alert.alert(
          'Compte existant',
          'Cette adresse email est déjà enregistrée. Veuillez utiliser la fonction "Se connecter" avec le bon mot de passe.',
          [{ text: 'OK' }]
        );
        throw new Error('Account already exists - use login instead');
      } else if (!authResult.success) {
        console.log('❌ Auth failed:', authResult.error);
        throw new Error(authResult.error || 'Failed to create user account');
      }

      console.log('✅ Auth account ready');

      // Step 2: Parent profile should be available (created by signUp or existing from signIn)
      console.log('✅ Parent profile ready');

      // Step 3: Link students
      console.log('🔄 Linking students...');
      console.log('🔄 Added students:', addedStudents);
      
      const studentsToLink: StudentToLink[] = addedStudents.map(student => ({
        school_id: student.school_id,
        student_id: student.student_id,
      }));

      console.log('🔄 Students to link:', studentsToLink);

      let linkResult;
      try {
        console.log('🔄 Linking students...');
        console.log('🔄 Students to link:', studentsToLink);
        
        linkResult = await linkStudentsBatch(studentsToLink);

        console.log('🔄 Link result received:', linkResult);

        if (!linkResult.success) {
          console.warn('⚠️ Some students could not be linked:', linkResult.errors);
          Alert.alert(
            'Attention',
            `Certains étudiants n'ont pas pu être liés: ${linkResult.errors.map(e => e.error).join(', ')}`,
            [{ text: 'OK' }]
          );
          // Continue anyway - parent can link more students later
        }

        if (linkResult.summary.successfully_linked === 0) {
          Alert.alert(
            'Aucun étudiant lié',
            'Aucun étudiant n\'a pu être lié à votre compte. Vous pourrez les lier manuellement plus tard.',
            [{ text: 'OK' }]
          );
        }

        console.log('✅ Students linked:', linkResult.summary.successfully_linked);
      } catch (linkError) {
        console.error('❌ Error during student linking:', linkError);
        console.error('❌ Link error type:', typeof linkError);
        console.error('❌ Link error message:', linkError instanceof Error ? linkError.message : String(linkError));
        console.error('❌ Link error stack:', linkError instanceof Error ? linkError.stack : 'No stack trace');
        
        const errorMsg = linkError instanceof Error ? linkError.message : 'Erreur inconnue';
        Alert.alert(
          'Liaison des étudiants échouée',
          `Votre compte a été créé avec succès, mais la liaison des étudiants a échoué: ${errorMsg}. Vous pourrez lier vos enfants manuellement depuis l'écran d'accueil.`,
          [{ text: 'Continuer' }]
        );
        
        // Create a mock result to continue the flow
        linkResult = {
          success: false,
          linked_students: [],
          errors: [{ school_id: '', student_id: '', error: 'Linking failed due to error' }],
          summary: { total_requested: studentsToLink.length, successfully_linked: 0, failed: studentsToLink.length }
        };
      }

      // Add linked students to Redux store to avoid API call on home screen
      console.log('🔄 Checking if students should be added to Redux store...');
      console.log('📊 Link result linked_students:', linkResult.linked_students);
      console.log('📊 Link result linked_students length:', linkResult.linked_students?.length);
      
      if (linkResult.linked_students && linkResult.linked_students.length > 0) {
        console.log('🔄 Adding students to Redux store...');
        linkResult.linked_students.forEach((student, index) => {
          console.log(`🔄 Adding student ${index + 1} to Redux:`, student);
          dispatch(addLinkedStudent({
            id: student.id,
            student_id: student.student_id,
            first_name: student.first_name,
            last_name: student.last_name,
            grade_level: student.grade_level || undefined,
            enrollment_date: new Date().toISOString().split('T')[0], // Default date
            status: 'active' as const,
            school_id: student.school_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            school_name: addedStudents.find(s => s.school_id === student.school_id)?.school_name || 'Unknown School'
          }));
        });
        console.log('✅ Students added to Redux store');
      } else {
        console.log('⚠️ No students to add to Redux store');
      }

      // Success! The auth state will automatically trigger navigation
      console.log('🎉 Registration completed successfully');
      console.log('📊 Final summary:', linkResult.summary);
      
      Alert.alert(
        'Inscription réussie!',
        `Votre compte a été créé avec succès! ${linkResult.summary.successfully_linked} étudiant(s) ont été liés à votre compte.`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error message:', error instanceof Error ? error.message : String(error));
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Show detailed error to user
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      Alert.alert(
        'Échec de l\'inscription',
        `Erreur: ${errorMessage}`,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToRegularRegister = () => {
    navigation.navigate('Register');
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Ajouter des étudiants</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>École</Text>
        <ScrollView style={styles.schoolPicker} nestedScrollEnabled>
          {schools.map((school) => (
            <TouchableOpacity
              key={school.id}
              style={[
                styles.schoolOption,
                selectedSchool?.id === school.id && styles.schoolOptionSelected
              ]}
              onPress={() => setSelectedSchool(school)}
            >
              <Text style={[
                styles.schoolOptionText,
                selectedSchool?.id === school.id && styles.schoolOptionTextSelected
              ]}>
                {school.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Numéro d'étudiant</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le numéro d'étudiant"
          placeholderTextColor="#9CA3AF"
          value={studentId}
          onChangeText={setStudentId}
          editable={!verifyingStudent}
        />
      </View>

      <TouchableOpacity
        style={[styles.verifyButton, verifyingStudent && styles.verifyButtonDisabled]}
        onPress={verifyStudent}
        disabled={!selectedSchool || !studentId.trim() || verifyingStudent}
      >
        {verifyingStudent ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.verifyButtonText}>Vérifier l'étudiant</Text>
        )}
      </TouchableOpacity>

      {studentLookupResult?.found && studentLookupResult.student && (
        <View style={styles.studentFoundContainer}>
          <Text style={styles.studentFoundTitle}>Étudiant trouvé:</Text>
          <Text style={styles.studentFoundText}>
            {studentLookupResult.student.first_name} {studentLookupResult.student.last_name}
          </Text>
          <Text style={styles.studentFoundSubtext}>
            {studentLookupResult.student.school_name} - {studentLookupResult.student.grade_level || 'Niveau non spécifié'}
          </Text>
          
          <TouchableOpacity
            style={styles.addStudentButton}
            onPress={addStudent}
          >
            <Text style={styles.addStudentButtonText}>Ajouter cet étudiant</Text>
          </TouchableOpacity>
        </View>
      )}

      {addedStudents.length > 0 && (
        <View style={styles.addedStudentsContainer}>
          <Text style={styles.addedStudentsTitle}>Étudiants ajoutés:</Text>
          {addedStudents.map((student, index) => (
            <View key={index} style={styles.addedStudentItem}>
              <View style={styles.addedStudentInfo}>
                <Text style={styles.addedStudentName}>{student.student_name}</Text>
                <Text style={styles.addedStudentDetails}>
                  {student.school_name} - {student.student_id}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeStudentButton}
                onPress={() => removeStudent(index)}
              >
                <Text style={styles.removeStudentButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Mot de passe et récapitulatif</Text>
      
      {parentInfo && (
        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Informations parent (extrait des données étudiant):</Text>
          <Text style={styles.reviewText}>{parentInfo.firstName} {parentInfo.lastName}</Text>
          <Text style={styles.reviewText}>{parentInfo.email}</Text>
          {parentInfo.phone && <Text style={styles.reviewText}>{parentInfo.phone}</Text>}
        </View>
      )}

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Étudiants à lier:</Text>
        {addedStudents.map((student, index) => (
          <View key={index} style={styles.reviewStudentItem}>
            <Text style={styles.reviewStudentName}>{student.student_name}</Text>
            <Text style={styles.reviewStudentDetails}>
              {student.school_name} - {student.student_id}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mot de passe</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.passwordInput, passwordError ? styles.inputError : null]}
            placeholder="Créez un mot de passe sécurisé"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError('');
              if (confirmPassword && confirmPasswordError) {
                setConfirmPasswordError('');
              }
            }}
            onBlur={() => validatePassword(password)}
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            <Text style={styles.eyeButtonText}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirmez le mot de passe</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.passwordInput, confirmPasswordError ? styles.inputError : null]}
            placeholder="Confirmez votre mot de passe"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmPasswordError) setConfirmPasswordError('');
            }}
            onBlur={() => validateConfirmPassword(confirmPassword)}
            secureTextEntry={!showConfirmPassword}
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={loading}
          >
            <Text style={styles.eyeButtonText}>
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        </View>
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
      </View>

      <Text style={styles.reviewNote}>
        Après l'inscription, vous serez automatiquement connecté et tous les étudiants seront liés à votre compte.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>HarakaPay</Text>
            <Text style={styles.subtitle}>Inscription rapide</Text>
            <Text style={styles.description}>
              Créez votre compte et liez vos enfants en quelques étapes
            </Text>
            <Text style={styles.stepIndicator}>Étape {currentStep} sur 2</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}

            {/* Navigation Buttons */}
            <View style={styles.navigationContainer}>
              {currentStep > 1 && (
                <TouchableOpacity
                  style={styles.previousButton}
                  onPress={handlePreviousStep}
                  disabled={loading}
                >
                  <Text style={styles.previousButtonText}>Précédent</Text>
                </TouchableOpacity>
              )}

              {currentStep < 2 ? (
                <TouchableOpacity
                  style={[styles.nextButton, loading && styles.nextButtonDisabled]}
                  onPress={handleNextStep}
                  disabled={loading}
                >
                  <Text style={styles.nextButtonText}>Suivant</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Créer le compte</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Auth Error Display */}
            {authError && (
              <View style={styles.authErrorContainer}>
                <Text style={styles.authErrorText}>{authError}</Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Vous avez déjà un compte ? </Text>
            <TouchableOpacity onPress={navigateToLogin} disabled={loading}>
              <Text style={styles.signInText}>Se connecter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Inscription classique ? </Text>
            <TouchableOpacity onPress={navigateToRegularRegister} disabled={loading}>
              <Text style={styles.signInText}>Inscription normale</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0080FF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  stepIndicator: {
    fontSize: 14,
    color: '#0080FF',
    fontWeight: '500',
  },
  form: {
    flex: 1,
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  eyeButtonText: {
    fontSize: 18,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  schoolPicker: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  schoolOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  schoolOptionSelected: {
    backgroundColor: '#EBF8FF',
  },
  schoolOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  schoolOptionTextSelected: {
    color: '#0080FF',
    fontWeight: '500',
  },
  verifyButton: {
    height: 52,
    backgroundColor: '#0080FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  studentFoundContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  studentFoundTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 8,
  },
  studentFoundText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 4,
  },
  studentFoundSubtext: {
    fontSize: 14,
    color: '#166534',
    marginBottom: 16,
  },
  addStudentButton: {
    backgroundColor: '#16A34A',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addStudentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addedStudentsContainer: {
    marginTop: 20,
  },
  addedStudentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  addedStudentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  addedStudentInfo: {
    flex: 1,
  },
  addedStudentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  addedStudentDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  removeStudentButton: {
    backgroundColor: '#EF4444',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeStudentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewSection: {
    marginBottom: 24,
  },
  reviewSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  reviewText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  reviewStudentItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  reviewStudentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  reviewStudentDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  reviewNote: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  previousButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previousButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  nextButton: {
    flex: 2,
    height: 52,
    backgroundColor: '#0080FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  submitButton: {
    flex: 2,
    height: 52,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  authErrorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  authErrorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 16,
    color: '#6B7280',
  },
  signInText: {
    fontSize: 16,
    color: '#0080FF',
    fontWeight: '600',
  },
});

export default QuickRegisterScreen;
