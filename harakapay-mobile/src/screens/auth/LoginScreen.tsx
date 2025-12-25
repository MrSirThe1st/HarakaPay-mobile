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

interface LoginScreenProps {
  navigation: any; // Replace with proper navigation type
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [pinError, setPinError] = useState('');

  const { signIn, loading, error: authError, user, initialized } = useAuth();

  // Navigate to main app if user is already logged in
  useEffect(() => {
    // When user is authenticated, root navigation will switch to main app automatically
  }, [initialized, user]);

  const formatPhoneNumber = (input: string): string => {
    const digitsOnly = input.replace(/\D/g, '');
    if (digitsOnly.length === 0) return '+243 ';
    const localNumber = digitsOnly.startsWith('243') ? digitsOnly.slice(3) : digitsOnly;
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
      setPinError('Le code PIN doit contenir 6 chiffres');
      return false;
    }
    if (!/^\d{6}$/.test(pinValue)) {
      setPinError('Le code PIN doit contenir uniquement des chiffres');
      return false;
    }
    setPinError('');
    return true;
  };

  const handleLogin = async () => {
    // Validate inputs
    const isPhoneValid = validatePhone(phone);
    const isPinValid = validatePin(pin);

    if (!isPhoneValid || !isPinValid) {
      return;
    }

    try {
      // Generate email from phone for authentication
      const digitsOnly = phone.replace(/\D/g, '');
      const localNumber = digitsOnly.startsWith('243') ? digitsOnly.slice(3) : digitsOnly;
      const generatedEmail = `243${localNumber}@harakapay.app`;

      const result = await signIn(generatedEmail, pin);
      
      if (result.success) {
        // Navigation will be handled by useEffect when user state changes
        console.log('Login successful');
      } else {
        Alert.alert(
          'Login Failed',
          result.error || 'Unable to sign in. Please check your credentials and try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
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
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Numéro de téléphone</Text>
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

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={navigateToForgotPassword}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[
                styles.signInButton,
                loading ? styles.signInButtonDisabled : null,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.signInButtonText}>
                {loading ? 'Signing In...' : 'Sign In'}
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
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToRegister} disabled={loading}>
              <Text style={styles.signUpText}>Sign Up</Text>
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
    marginBottom: 48,
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
  inputContainer: {
    marginBottom: 24,
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.blue.light,
    fontWeight: '500',
  },
  signInButton: {
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
  signInButtonDisabled: {
    backgroundColor: colors.blue.medium,
  },
  signInButtonText: {
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
    paddingTop: 32,
  },
  footerText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  signUpText: {
    fontSize: 16,
    color: colors.blue.light,
    fontWeight: '600',
  },
});

export default LoginScreen;