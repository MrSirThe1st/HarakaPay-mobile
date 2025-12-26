import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../hooks/useI18n';
import { deleteAccount } from '../../api/authApi';
import colors from '../../constants/colors';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { signOut, profile } = useAuth();
  const { t, currentLanguage, changeLanguage } = useI18n('profile');
  const [deleting, setDeleting] = useState(false);

  const handleLanguageChange = async (lang: string) => {
    await changeLanguage(lang);
  };

  const handleLogout = () => {
    Alert.alert(
      t('logoutConfirm.title'),
      t('logoutConfirm.message'),
      [
        { text: t('logoutConfirm.cancel'), style: 'cancel' },
        {
          text: t('logoutConfirm.confirm'),
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('deleteAccountConfirm.title'),
      t('deleteAccountConfirm.message'),
      [
        { text: t('deleteAccountConfirm.cancel'), style: 'cancel' },
        {
          text: t('deleteAccount'),
          style: 'destructive',
          onPress: () => confirmDeleteAccount(),
        },
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      t('deleteAccountConfirm.title'),
      t('deleteAccountConfirm.message'),
      [
        { text: t('deleteAccountConfirm.cancel'), style: 'cancel' },
        {
          text: t('deleteAccountConfirm.confirm'),
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteAccount();
              Alert.alert(
                t('deleteAccountConfirm.title'),
                t('success.updated'),
                [{ text: t('common:buttons.ok'), onPress: () => signOut() }]
              );
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert(t('common:labels.error'), t('errors.updateFailed'));
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleNavigateToMessages = () => {
    (navigation as any).navigate('Tabs', { screen: 'Messages' });
  };

  const handleOpenTerms = async () => {
    const webUrl = Constants.expoConfig?.extra?.WEB_API_URL || 'https://www.harakapayment.com';
    const termsUrl = `${webUrl}/terms`;
    const supported = await Linking.canOpenURL(termsUrl);
    if (supported) {
      await Linking.openURL(termsUrl);
    } else {
      Alert.alert(t('common:labels.error'), 'Cannot open URL');
    }
  };

  const handleOpenPrivacy = async () => {
    const webUrl = Constants.expoConfig?.extra?.WEB_API_URL || 'https://www.harakapayment.com';
    const privacyUrl = `${webUrl}/privacy`;
    const supported = await Linking.canOpenURL(privacyUrl);
    if (supported) {
      await Linking.openURL(privacyUrl);
    } else {
      Alert.alert(t('common:labels.error'), 'Cannot open URL');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('personalInfo')}</Text>

          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle" size={64} color={colors.primary} />
            </View>
            <Text style={styles.profileName}>
              {profile?.first_name} {profile?.last_name}
            </Text>
            <Text style={styles.profileEmail}>{profile?.email}</Text>
            {profile?.phone && (
              <Text style={styles.profilePhone}>{profile.phone}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('language.title')}</Text>
          <View style={styles.languageContainer}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                currentLanguage === 'fr' && styles.languageButtonActive
              ]}
              onPress={() => handleLanguageChange('fr')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.languageButtonText,
                currentLanguage === 'fr' && styles.languageButtonTextActive
              ]}>
                {t('language.french')}
              </Text>
              {currentLanguage === 'fr' && (
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                currentLanguage === 'en' && styles.languageButtonActive
              ]}
              onPress={() => handleLanguageChange('en')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.languageButtonText,
                currentLanguage === 'en' && styles.languageButtonTextActive
              ]}>
                {t('language.english')}
              </Text>
              {currentLanguage === 'en' && (
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.title')}</Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="log-out-outline" size={24} color={colors.text.primary} />
              <Text style={styles.menuItemText}>{t('logout')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('legal.title')}</Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleOpenTerms}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="document-text-outline" size={24} color={colors.text.primary} />
              <Text style={styles.menuItemText}>{t('legal.terms')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleOpenPrivacy}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={24} color={colors.text.primary} />
              <Text style={styles.menuItemText}>{t('legal.privacy')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>

          <TouchableOpacity
            style={[styles.menuItem, styles.dangerItem]}
            onPress={handleDeleteAccount}
            disabled={deleting}
          >
            <View style={styles.menuItemLeft}>
              {deleting ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
              )}
              <Text style={[styles.menuItemText, styles.dangerText]}>
                {deleting ? t('common:labels.loading') : t('deleteAccount')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>HarakaPay Mobile v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  infoNotice: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth:1
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  messageLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  messageLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
  },
  dangerItem: {
    backgroundColor: '#FEF2F2',
  },
  dangerText: {
    color: '#EF4444',
  },
  footer: {
    alignItems: 'center',
    padding: 32,
  },
  footerText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  languageContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 8,
  },
  languageButtonActive: {
    borderColor: colors.primary,
    backgroundColor: '#E8F4FD',
  },
  languageButtonText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  languageButtonTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});

export default ProfileScreen;
