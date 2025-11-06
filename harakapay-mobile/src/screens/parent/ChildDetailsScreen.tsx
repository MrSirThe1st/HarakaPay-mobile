import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinkedStudent } from '../../api/studentApi';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window');

interface ChildDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      student: {
        id: string;
        first_name?: string | null;
        last_name?: string | null;
        grade_level?: string;
        school_name?: string;
        student_id?: string;
        enrollment_date?: string;
        status?: string;
        parent_name?: string;
        parent_email?: string;
        parent_phone?: string;
      };
    };
  };
}

export default function ChildDetailsScreen({ navigation, route }: ChildDetailsScreenProps) {
  const { student } = route.params;
  
  console.log('🔍 ChildDetailsScreen - Received student:', student);
  console.log('🔍 ChildDetailsScreen - student.first_name:', student.first_name);
  console.log('🔍 ChildDetailsScreen - student.last_name:', student.last_name);

  // Safety check - if student data is invalid, go back
  if (!student || !student.id) {
    console.log('❌ ChildDetailsScreen - Invalid student data, going back');
    navigation.goBack();
    return null;
  }

  const handleMakePayment = () => {
    // Navigate directly to Payments screen in the stack and pass params
    navigation.navigate('Payments', { student: student });
  };

  const handleDownloadReceipt = () => {
    // Navigate to receipts screen or show receipt options
    Alert.alert(
      'Download Receipt',
      'Receipt download functionality will be implemented here.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>


        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleMakePayment}
            activeOpacity={0.8}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>💳</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Make Payment</Text>
              <Text style={styles.actionSubtitle}>Pay school fees and other charges</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownloadReceipt}
            activeOpacity={0.8}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>📄</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Download Receipt</Text>
              <Text style={styles.actionSubtitle}>Get payment receipts and invoices</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

 
       
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Very dark blue
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.blue.light, // Light blue
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary, // White
  },
  studentCard: {
    backgroundColor: colors.cardBackground, // Light blue card
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.blue.light, // Light blue border
  },
  photoContainer: {
    marginBottom: 20,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary, // Bright blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  studentInfo: {
    alignItems: 'center',
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.inverse, // Dark text for light card
    marginBottom: 8,
    textAlign: 'center',
  },
  studentDetail: {
    fontSize: 16,
    color: '#4A5568', // Darker gray for light blue background
    marginBottom: 4,
    textAlign: 'center',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary, // White
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: colors.cardBackground, // Light blue card
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.blue.lighter, // Sky blue border
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.blue.pale, // Pale blue background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.inverse, // Dark text for light card
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#4A5568', // Darker gray
  },
  actionArrow: {
    fontSize: 24,
    color: colors.blue.medium, // Medium blue
    fontWeight: 'bold',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  infoCard: {
    backgroundColor: colors.cardBackground, // Light blue card
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.blue.lighter, // Sky blue border
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.blue.lighter, // Sky blue divider
  },
  infoLabel: {
    fontSize: 16,
    color: '#4A5568', // Darker gray
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: colors.text.inverse, // Dark text
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
});
