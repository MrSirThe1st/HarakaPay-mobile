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

interface LoginScreenProps {
  navigation: any; // Replace with proper navigation type
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [pinError, setPinError] = useState('');

  const { signIn, loading, error: authError, user, initialized } = useAuth();
  const { t } = useI18n('auth');

  // Navigate to main app if user is already logged in
  useEffect(() => {
    // When user is authenticated, root navigation will switch to main app automatically
  }, [initialized, user]);

  const validateEmail = (emailValue: string): boolean => {
    if (!emailValue || emailValue.trim() === '') {
      setEmailError(t('login.errors.emailRequired'));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError(t('login.errors.emailInvalid'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePin = (pinValue: string): boolean => {
    if (!pinValue) {
      setPinError(t('login.errors.pinRequired'));
      return false;
    }
    if (pinValue.length !== 6) {
      setPinError(t('login.errors.pinLength'));
      return false;
    }
    if (!/^\d{6}$/.test(pinValue)) {
      setPinError(t('login.errors.pinDigitsOnly'));
      return false;
    }
    setPinError('');
    return true;
  };

  const handleLogin = async () => {
    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPinValid = validatePin(pin);

    if (!isEmailValid || !isPinValid) {
      return;
    }

    try {
      const result = await signIn(email.toLowerCase().trim(), pin);
      
      if (result.success) {
        // Navigation will be handled by useEffect when user state changes
        console.log('Login successful');
      } else {
        Alert.alert(
          t('login.errors.loginFailed'),
          result.error || t('login.errors.invalidCredentials'),
          [{ text: t('common.ok') }]
        );
      }
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('login.errors.unexpectedError'),
        [{ text: t('common.ok') }]
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
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('login.emailLabel')}</Text>
              <TextInput
                style={[
                  styles.input,
                  emailError ? styles.inputError : null,
                ]}
                placeholder={t('login.emailPlaceholder')}
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
              <Text style={styles.label}>{t('login.pinLabel')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.pinInput,
                    pinError ? styles.inputError : null,
                  ]}
                  placeholder={t('login.pinPlaceholder')}
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
              <Text style={styles.pinCounter}>{t('login.pinCounter', { current: pin.length, max: 6 })}</Text>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={navigateToForgotPassword}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>{t('login.forgotPassword')}</Text>
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
                {loading ? t('login.signingIn') : t('login.signInButton')}
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
            <Text style={styles.footerText}>{t('login.noAccount')}</Text>
            <TouchableOpacity onPress={navigateToRegister} disabled={loading}>
              <Text style={styles.signUpText}>{t('login.signUpLink')}</Text>
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