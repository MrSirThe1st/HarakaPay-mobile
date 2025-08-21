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
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';

const { width, height } = Dimensions.get('window');

interface RegisterScreenProps {
  navigation: any; // Replace with proper navigation type
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form validation states
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const { signUp, loading, error: authError, user, initialized } = useAuth();

  // Navigate to main app if user is already logged in
  useEffect(() => {
    if (initialized && user) {
  navigation.replace('Tabs');
    }
  }, [initialized, user, navigation]);

  const validateFirstName = (name: string): boolean => {
    if (!name.trim()) {
      setFirstNameError('Le prénom est obligatoire');
      return false;
    }
    if (name.trim().length < 2) {
      setFirstNameError('Le prénom doit contenir au moins 2 caractères');
      return false;
    }
    setFirstNameError('');
    return true;
  };

  const validateLastName = (name: string): boolean => {
    if (!name.trim()) {
      setLastNameError('Le nom de famille est obligatoire');
      return false;
    }
    if (name.trim().length < 2) {
      setLastNameError('Le nom de famille doit contenir au moins 2 caractères');
      return false;
    }
    setLastNameError('');
    return true;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('L\'adresse email est obligatoire');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Veuillez entrer une adresse email valide');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = (phone: string): boolean => {
    // Congo phone number format validation (optional field)
    if (phone.trim() && phone.trim().length < 9) {
      setPhoneError('Veuillez entrer un numéro de téléphone valide');
      return false;
    }
    setPhoneError('');
    return true;
  };

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

  const handleRegister = async () => {
    // Validate all inputs
    const isFirstNameValid = validateFirstName(firstName);
    const isLastNameValid = validateLastName(lastName);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (
      !isFirstNameValid ||
      !isLastNameValid ||
      !isEmailValid ||
      !isPhoneValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid
    ) {
      return;
    }

    try {
      const result = await signUp(
        email,
        password,
        firstName,
        lastName,
        phone || undefined
      );

      if (result.success) {
        Alert.alert(
          'Inscription réussie',
          'Votre compte a été créé avec succès ! Veuillez vérifier votre email pour confirmer votre inscription.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } else {
        Alert.alert(
          'Échec de l\'inscription',
          result.error || 'Impossible de créer le compte. Veuillez réessayer.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur inattendue s\'est produite. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

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
            <Text style={styles.subtitle}>Créer un compte</Text>
            <Text style={styles.description}>
              Rejoignez des milliers de parents qui simplifient le paiement des frais scolaires
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name Fields - Congolese Convention */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Prénom</Text>
              <TextInput
                style={[
                  styles.input,
                  firstNameError ? styles.inputError : null,
                ]}
                placeholder="Entrez votre prénom"
                placeholderTextColor="#9CA3AF"
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  if (firstNameError) setFirstNameError('');
                }}
                onBlur={() => validateFirstName(firstName)}
                autoCapitalize="words"
                editable={!loading}
              />
              {firstNameError ? (
                <Text style={styles.errorText}>{firstNameError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom de famille</Text>
              <TextInput
                style={[
                  styles.input,
                  lastNameError ? styles.inputError : null,
                ]}
                placeholder="Entrez votre nom de famille"
                placeholderTextColor="#9CA3AF"
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  if (lastNameError) setLastNameError('');
                }}
                onBlur={() => validateLastName(lastName)}
                autoCapitalize="words"
                editable={!loading}
              />
              {lastNameError ? (
                <Text style={styles.errorText}>{lastNameError}</Text>
              ) : null}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Adresse email</Text>
              <TextInput
                style={[
                  styles.input,
                  emailError ? styles.inputError : null,
                ]}
                placeholder="Entrez votre adresse email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                onBlur={() => validateEmail(email)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Numéro de téléphone (Optionnel)</Text>
              <TextInput
                style={[
                  styles.input,
                  phoneError ? styles.inputError : null,
                ]}
                placeholder="Ex: +243 XXX XXX XXX"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (phoneError) setPhoneError('');
                }}
                onBlur={() => validatePhone(phone)}
                keyboardType="phone-pad"
                editable={!loading}
              />
              {phoneError ? (
                <Text style={styles.errorText}>{phoneError}</Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    passwordError ? styles.inputError : null,
                  ]}
                  placeholder="Créez un mot de passe sécurisé"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                    // Re-validate confirm password if it's already filled
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
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmez le mot de passe</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    confirmPasswordError ? styles.inputError : null,
                  ]}
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
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              ) : null}
            </View>

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                En créant un compte, vous acceptez nos{' '}
                <Text style={styles.linkText}>Conditions d'utilisation</Text> et notre{' '}
                <Text style={styles.linkText}>Politique de confidentialité</Text>
              </Text>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                styles.signUpButton,
                loading ? styles.signUpButtonDisabled : null,
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.signUpButtonText}>
                {loading ? 'Création du compte...' : 'Créer le compte'}
              </Text>
            </TouchableOpacity>

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
  },
  form: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nameInput: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
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
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    color: '#0080FF',
    fontWeight: '500',
  },
  signUpButton: {
    height: 52,
    backgroundColor: '#0080FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  signUpButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  signUpButtonText: {
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
    marginTop: 'auto',
    paddingTop: 24,
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

export default RegisterScreen;