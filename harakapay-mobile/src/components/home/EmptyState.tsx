import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface EmptyStateProps {
  onLinkStudent: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onLinkStudent }) => {
  return (
    <View style={styles.container}>
      {/* Illustration Placeholder */}
      <View style={styles.illustrationContainer}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>👨‍👩‍👧‍👦</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Connect Your Children</Text>
        <Text style={styles.subtitle}>
          Link your children's accounts to manage their school fees, payments, and activities all in one place.
        </Text>
        
        <Text style={styles.description}>
          We'll automatically find your children using your contact information, making the process quick and secure.
        </Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.linkButton}
        onPress={onLinkStudent}
        activeOpacity={0.8}
      >
        <Text style={styles.linkButtonText}>Link Your First Child</Text>
      </TouchableOpacity>

      {/* Help Text */}
      <Text style={styles.helpText}>
        Need help? Contact your school for assistance.
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
    backgroundColor: '#F8F9FA',
  },
  illustrationContainer: {
    marginBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  iconText: {
    fontSize: 48,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  linkButton: {
    backgroundColor: '#0080FF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
