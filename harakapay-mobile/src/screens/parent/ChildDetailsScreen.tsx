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
    // Navigate to payment screen
    navigation.navigate('Payments', { studentId: student.id });
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Child Details</Text>
        </View>

        {/* Student Details Card */}
        <View style={styles.studentCard}>
          {/* Profile Photo */}
          <View style={styles.photoContainer}>
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoText}>
                {(student.first_name || 'S').charAt(0)}{(student.last_name || 'T').charAt(0)}
              </Text>
            </View>
          </View>

          {/* Student Info */}
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>
              {student.first_name || 'Unknown'} {student.last_name || 'Student'}
            </Text>
            
            {student.grade_level && (
              <Text style={styles.studentDetail}>Grade {student.grade_level}</Text>
            )}
            
            {student.school_name && (
              <Text style={styles.studentDetail}>{student.school_name}</Text>
            )}
            
            <Text style={styles.studentDetail}>Student ID: {student.student_id}</Text>
          </View>
        </View>

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

        {/* Additional Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Enrollment Date</Text>
              <Text style={styles.infoValue}>
                {new Date(student.enrollment_date).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={[styles.infoValue, { 
                color: student.status === 'active' ? '#10B981' : '#EF4444' 
              }]}>
                {(student.status || 'Unknown').charAt(0).toUpperCase() + (student.status || 'Unknown').slice(1)}
              </Text>
            </View>
            
            {student.parent_name && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Parent Name</Text>
                <Text style={styles.infoValue}>{student.parent_name}</Text>
              </View>
            )}
            
            {student.parent_email && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Parent Email</Text>
                <Text style={styles.infoValue}>{student.parent_email}</Text>
              </View>
            )}
            
            {student.parent_phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Parent Phone</Text>
                <Text style={styles.infoValue}>{student.parent_phone}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
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
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#0080FF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  studentCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  photoContainer: {
    marginBottom: 20,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0080FF',
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
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  studentDetail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
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
    color: '#1F2937',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionArrow: {
    fontSize: 24,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
});
