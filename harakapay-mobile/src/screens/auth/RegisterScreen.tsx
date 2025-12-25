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
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import colors from '../../constants/colors';

const { width, height } = Dimensions.get('window');

interface RegisterScreenProps {
  navigation: any; // Replace with proper navigation type
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Form validation states
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [pinError, setPinError] = useState('');

  const { signUp, loading, error: authError, user, initialized } = useAuth();

  // Navigate to main app if user is already logged in
  useEffect(() => {
    // When user is authenticated, root navigation will switch to main app automatically
  }, [initialized, user]);

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
    // Email is optional
    if (!email.trim()) {
      setEmailError('');
      return true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Veuillez entrer une adresse email valide');
      return false;
    }
    setEmailError('');
    return true;
  };

  const formatPhoneNumber = (input: string): string => {
    // Remove all non-digits
    const digitsOnly = input.replace(/\D/g, '');

    // Add +243 prefix and format
    if (digitsOnly.length === 0) return '+243 ';

    // Remove +243 if already present to avoid duplication
    const localNumber = digitsOnly.startsWith('243') ? digitsOnly.slice(3) : digitsOnly;

    // Format: +243 XXX XXX XXX
    let formatted = '+243 ';
    if (localNumber.length > 0) formatted += localNumber.slice(0, 3);
    if (localNumber.length > 3) formatted += ' ' + localNumber.slice(3, 6);
    if (localNumber.length > 6) formatted += ' ' + localNumber.slice(6, 9);

    return formatted;
  };

  const validatePhone = (phoneValue: string): boolean => {
    if (!phoneValue || phoneValue.trim() === '+243 ' || phoneValue.trim() === '') {
      setPhoneError('Le numéro de téléphone est obligatoire');
      return false;
    }

    const digitsOnly = phoneValue.replace(/\D/g, '');
    const localNumber = digitsOnly.startsWith('243') ? digitsOnly.slice(3) : digitsOnly;

    if (localNumber.length !== 9) {
      setPhoneError('Le numéro doit contenir exactement 9 chiffres');
      return false;
    }

    setPhoneError('');
    return true;
  };

  const validatePin = (pinValue: string): boolean => {
    if (!pinValue) {
      setPinError('Le code PIN est obligatoire');
      return false;
    }
    if (pinValue.length !== 6) {
      setPinError('Le code PIN doit contenir exactement 6 chiffres');
      return false;
    }
    if (!/^\d{6}$/.test(pinValue)) {
      setPinError('Le code PIN doit contenir uniquement des chiffres');
      return false;
    }
    setPinError('');
    return true;
  };

  const handleRegister = async () => {
    // Validate all inputs
    const isFirstNameValid = validateFirstName(firstName);
    const isLastNameValid = validateLastName(lastName);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isPinValid = validatePin(pin);

    if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPhoneValid || !isPinValid) {
      return;
    }

    try {
      // Format phone number
      const digitsOnly = phone.replace(/\D/g, '');
      const localNumber = digitsOnly.startsWith('243') ? digitsOnly.slice(3) : digitsOnly;
      const formattedPhone = `+243${localNumber}`;

      // Use provided email or generate from phone number
      const emailToUse = email.trim() || `243${localNumber}@harakapay.app`;

      const result = await signUp({
        email: emailToUse.toLowerCase(),
        password: pin,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: formattedPhone
      });

      if (result.success) {
        Alert.alert(
          'Inscription réussie',
          'Votre compte a été créé avec succès ! Vous êtes maintenant connecté.',  
          [
            {
              text: 'OK',
              // Don't navigate - the app will automatically redirect to main app
              // because the user is now authenticated
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
            <Text style={styles.subtitle}>Créer un compte</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* First Name Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  firstNameError ? styles.inputError : null,
                ]}
                placeholder="Prénom"
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

            {/* Last Name Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  lastNameError ? styles.inputError : null,
                ]}
                placeholder="Nom de famille"
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

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.phoneInput,
                  phoneError ? styles.inputError : null,
                ]}
                placeholder="+243 XXX XXX XXX"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={(text) => {
                  const formatted = formatPhoneNumber(text);
                  setPhone(formatted);
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

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  emailError ? styles.inputError : null,
                ]}
                placeholder="Adresse email (Optionnel)"
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

            {/* PIN Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Code PIN (6 chiffres)</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.pinInput,
                    pinError ? styles.inputError : null,
                  ]}
                  placeholder="••••••"
                  placeholderTextColor="#9CA3AF"
                  value={pin}
                  onChangeText={(text) => {
                    const digitsOnly = text.replace(/[^0-9]/g, '').slice(0, 6);
                    setPin(digitsOnly);
                    if (pinError) setPinError('');
                  }}
                  onBlur={() => validatePin(pin)}
                  secureTextEntry={!showPin}
                  keyboardType="numeric"
                  maxLength={6}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPin(!showPin)}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPin ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>
              {pinError ? (
                <Text style={styles.errorText}>{pinError}</Text>
              ) : null}
              <Text style={styles.pinCounter}>{pin.length}/6</Text>
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

          {/* Quick registration temporarily disabled */}
          {/* <View style={styles.footer}>
            <Text style={styles.footerText}>Vous avez un numéro d'étudiant ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('QuickRegister')} disabled={loading}>
              <Text style={styles.signInText}>Inscription rapide</Text>
            </TouchableOpacity>
          </View> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Very dark blue
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
    color: colors.primary, // Bright blue
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary, // White
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary, // Light gray-blue
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
    color: colors.text.primary, // White
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.blue.dark, // Medium dark blue border
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'System',
    backgroundColor: colors.blue.darker, // Dark blue background
    color: colors.text.primary, // White text
  },
  phoneInput: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.blue.dark,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'System',
    backgroundColor: colors.blue.darker,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: '#2A1A1A', // Dark red background
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
    borderColor: colors.blue.dark,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
    backgroundColor: colors.blue.darker,
    color: colors.text.primary,
  },
  pinInput: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: colors.blue.dark,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 8,
    backgroundColor: colors.blue.darker,
    color: colors.text.primary,
    textAlign: 'center',
  },
  helperText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  pinCounter: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
    textAlign: 'right',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 4,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 14,
    color: colors.text.secondary, // Light gray-blue
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    color: colors.blue.light, // Light blue
    fontWeight: '500',
  },
  signUpButton: {
    height: 52,
    backgroundColor: colors.primary, // Bright blue
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signUpButtonDisabled: {
    backgroundColor: colors.blue.medium, // Medium blue when disabled
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  authErrorContainer: {
    backgroundColor: '#2A1A1A', // Dark red background
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.error,
  },
  authErrorText: {
    fontSize: 14,
    color: colors.error,
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
    color: colors.text.secondary, // Light gray-blue
  },
  signInText: {
    fontSize: 16,
    color: colors.blue.light, // Light blue
    fontWeight: '600',
  },
});

export default RegisterScreen;