import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useI18n } from '../../hooks/useI18n';
import colors from '../../constants/colors';

const { width, height } = Dimensions.get('window');

interface EmptyStateProps {
  onLinkStudent: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onLinkStudent }) => {
  const { t } = useI18n('dashboard');

  return (
    <View style={styles.container}>
      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{t('emptyState.title')}</Text>
        <Text style={styles.description}>
          {t('emptyState.description')}
        </Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.linkButton}
        onPress={onLinkStudent}
        activeOpacity={0.8}
      >
        <Text style={styles.linkButtonText}>{t('emptyState.linkButton')}</Text>
      </TouchableOpacity>

      {/* Help Text */}
      <Text style={styles.helpText}>
        {t('emptyState.helpText')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: colors.background, // Very dark blue
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary, // White text
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.text.secondary, // Light gray-blue
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary, // Light gray-blue
    textAlign: 'center',
    lineHeight: 24,
  },
  linkButton: {
    backgroundColor: colors.primary, // #0080FF
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  linkButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  helpText: {
    fontSize: 14,
    color: colors.text.secondary, // Light gray-blue
    textAlign: 'center',
  },
});
