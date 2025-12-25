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
import { useI18n } from '../../hooks/useI18n';
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
  const { t } = useI18n('auth');

  // Navigate to main app if user is already logged in
  useEffect(() => {
    // When user is authenticated, root navigation will switch to main app automatically
  }, [initialized, user]);

  const validateFirstName = (name: string): boolean => {
    if (!name.trim()) {
      setFirstNameError(t('register.errors.firstNameRequired'));
      return false;
    }
    if (name.trim().length < 2) {
      setFirstNameError(t('register.errors.firstNameTooShort'));
      return false;
    }
    setFirstNameError('');
    return true;
  };

  const validateLastName = (name: string): boolean => {
    if (!name.trim()) {
      setLastNameError(t('register.errors.lastNameRequired'));
      return false;
    }
    if (name.trim().length < 2) {
      setLastNameError(t('register.errors.lastNameTooShort'));
      return false;
    }
    setLastNameError('');
    return true;
  };

  const validateEmail = (email: string): boolean => {
    // Email is now required
    if (!email.trim()) {
      setEmailError(t('register.errors.emailRequired'));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(t('register.errors.emailInvalid'));
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
      setPhoneError(t('register.errors.phoneRequired'));
      return false;
    }

    const digitsOnly = phoneValue.replace(/\D/g, '');
    const localNumber = digitsOnly.startsWith('243') ? digitsOnly.slice(3) : digitsOnly;

    if (localNumber.length !== 9) {
      setPhoneError(t('register.errors.phoneInvalid'));
      return false;
    }

    setPhoneError('');
    return true;
  };

  const validatePin = (pinValue: string): boolean => {
    if (!pinValue) {
      setPinError(t('register.errors.pinRequired'));
      return false;
    }
    if (pinValue.length !== 6) {
      setPinError(t('register.errors.pinLength'));
      return false;
    }
    if (!/^\d{6}$/.test(pinValue)) {
      setPinError(t('register.errors.pinDigitsOnly'));
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

      const result = await signUp({
        email: email.toLowerCase().trim(),
        password: pin,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: formattedPhone
      });

      if (result.success) {
        Alert.alert(
          t('register.success.title'),
          t('register.success.message'),
          [
            {
              text: t('common.ok'),
              // Don't navigate - the app will automatically redirect to main app
              // because the user is now authenticated
            },
          ]
        );
      } else {
        Alert.alert(
          t('register.failure.title'),
          result.error || t('register.failure.message'),
          [{ text: t('common.ok') }]
        );
      }
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('register.failure.message'),
        [{ text: t('common.ok') }]
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
            <Text style={styles.subtitle}>{t('register.title')}</Text>
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
                placeholder={t('register.firstNamePlaceholder')}
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
                placeholder={t('register.lastNamePlaceholder')}
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
                placeholder={t('register.phonePlaceholder')}
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
                placeholder={t('register.emailPlaceholder')}
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
              <Text style={styles.label}>{t('register.pinLabel')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.pinInput,
                    pinError ? styles.inputError : null,
                  ]}
                  placeholder={t('register.pinPlaceholder')}
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
              <Text style={styles.pinCounter}>{t('register.pinCounter', { current: pin.length, max: 6 })}</Text>
            </View>

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                {t('register.termsText')}
                <Text style={styles.linkText}>{t('register.termsLink')}</Text>
                {t('register.termsAnd')}
                <Text style={styles.linkText}>{t('register.privacyLink')}</Text>
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
                {loading ? t('register.creatingAccount') : t('register.signUpButton')}
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
            <Text style={styles.footerText}>{t('register.hasAccount')}</Text>
            <TouchableOpacity onPress={navigateToLogin} disabled={loading}>
              <Text style={styles.signInText}>{t('register.signInLink')}</Text>
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
    backgroundColor: colors.background,
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
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
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
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'System',
    backgroundColor: colors.surface,
    color: colors.text.primary,
  },
  phoneInput: {
    height: 52,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'System',
    backgroundColor: colors.surface,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.error,
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
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.text.primary,
  },
  pinInput: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 8,
    backgroundColor: colors.surface,
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
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    color: colors.blue.light,
    fontWeight: '500',
  },
  signUpButton: {
    height: 52,
    backgroundColor: colors.primary,
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
    backgroundColor: colors.blue.medium,
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
    color: colors.text.secondary,
  },
  signInText: {
    fontSize: 16,
    color: colors.blue.light,
    fontWeight: '600',
  },
});

export default RegisterScreen;