// harakapay-mobile/src/screens/ChildrenTabScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../hooks/useAuth';

const { width } = Dimensions.get('window');

interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  grade_level: string | null;
  status: 'active' | 'inactive' | 'graduated';
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'other' | null;
  school: {
    id: string;
    name: string;
    address: string | null;
  };
}

interface ParentStudent {
  id: string;
  relationship_type: string;
  is_primary: boolean;
  can_make_payments: boolean;
  can_receive_notifications: boolean;
  student: Student;
}

interface Payment {
  id: string;
  amount: number;
  payment_date: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
}

interface ChildrenTabScreenProps {
  navigation: any;
}

export default function ChildrenScreen({ navigation }: ChildrenTabScreenProps) {
  const { parent } = useAuth();
  const [children, setChildren] = useState<ParentStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recentPayments, setRecentPayments] = useState<{ [studentId: string]: Payment }>({});

  // Load children data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadChildren();
    }, [])
  );

  const loadChildren = async () => {
    if (!parent) return;

    try {
      setLoading(true);

      // Fetch connected children with school info
      const { data, error } = await supabase
        .from('parent_students')
        .select(`
          *,
          student:students(
            *,
            school:schools(id, name, address)
          )
        `)
        .eq('parent_id', parent.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setChildren(data || []);

      // Load recent payments for each child
      if (data && data.length > 0) {
        await loadRecentPayments(data.map(c => c.student.id));
      }

    } catch (error) {
      console.error('Error loading children:', error);
      Alert.alert('Error', 'Failed to load children. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadRecentPayments = async (studentIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .in('student_id', studentIds)
        .eq('status', 'completed')
        .order('payment_date', { ascending: false })
        .limit(studentIds.length); // Get latest payment for each student

      if (error) throw error;

      // Group payments by student_id (latest payment per student)
      const paymentsMap: { [studentId: string]: Payment } = {};
      data?.forEach(payment => {
        if (!paymentsMap[payment.student_id]) {
          paymentsMap[payment.student_id] = payment;
        }
      });

      setRecentPayments(paymentsMap);
    } catch (error) {
      console.error('Error loading recent payments:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChildren();
    setRefreshing(false);
  };

  const handleChildPress = (child: ParentStudent) => {
    navigation.navigate('ChildDetails', { 
      childId: child.student.id,
      studentName: `${child.student.first_name} ${child.student.last_name}`
    });
  };

  const handleAddChild = () => {
    navigation.navigate('ConnectChild');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#F59E0B';
      case 'graduated': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getGradeDisplay = (grade: string | null) => {
    return grade || 'Not specified';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0080FF" />
        <Text style={styles.loadingText}>Loading your children...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Children</Text>
        <Text style={styles.subtitle}>
          {children.length} {children.length === 1 ? 'child' : 'children'} connected
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {children.length > 0 ? (
          <>
            {/* Children List */}
            <View style={styles.childrenList}>
              {children.map((child) => {
                const lastPayment = recentPayments[child.student.id];
                
                return (
                  <TouchableOpacity
                    key={child.id}
                    style={styles.childCard}
                    onPress={() => handleChildPress(child)}
                    activeOpacity={0.7}
                  >
                    {/* Child Avatar */}
                    <View style={styles.avatarContainer}>
                      {child.student.avatar_url ? (
                        <Image
                          source={{ uri: child.student.avatar_url }}
                          style={styles.avatar}
                        />
                      ) : (
                        <View style={[styles.avatarPlaceholder, { backgroundColor: child.student.gender === 'female' ? '#F472B6' : '#3B82F6' }]}>
                          <Text style={styles.avatarText}>
                            {child.student.first_name.charAt(0)}{child.student.last_name.charAt(0)}
                          </Text>
                        </View>
                      )}
                      
                      {/* Status Badge */}
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(child.student.status) }]}>
                        <View style={styles.statusDot} />
                      </View>
                    </View>

                    {/* Child Info */}
                    <View style={styles.childInfo}>
                      <Text style={styles.childName}>
                        {child.student.first_name} {child.student.last_name}
                      </Text>
                      <Text style={styles.schoolName}>
                        {child.student.school.name}
                      </Text>
                      <Text style={styles.gradeText}>
                        Grade: {getGradeDisplay(child.student.grade_level)}
                      </Text>
                      <Text style={styles.studentId}>
                        ID: {child.student.student_id}
                      </Text>
                    </View>

                    {/* Payment Info */}
                    <View style={styles.paymentInfo}>
                      {lastPayment ? (
                        <>
                          <Text style={styles.lastPaymentLabel}>Last Payment</Text>
                          <Text style={styles.lastPaymentAmount}>
                            {formatCurrency(lastPayment.amount)}
                          </Text>
                          <Text style={styles.lastPaymentDate}>
                            {formatDate(lastPayment.payment_date)}
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.noPaymentText}>No payments yet</Text>
                      )}
                    </View>

                    {/* Permissions */}
                    <View style={styles.permissionsContainer}>
                      {child.can_make_payments && (
                        <View style={styles.permissionBadge}>
                          <Text style={styles.permissionText}>💳</Text>
                        </View>
                      )}
                      {child.can_receive_notifications && (
                        <View style={styles.permissionBadge}>
                          <Text style={styles.permissionText}>🔔</Text>
                        </View>
                      )}
                      {child.is_primary && (
                        <View style={[styles.permissionBadge, styles.primaryBadge]}>
                          <Text style={styles.primaryText}>Primary</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Add Another Child Button */}
            <TouchableOpacity
              style={styles.addChildButton}
              onPress={handleAddChild}
              activeOpacity={0.8}
            >
              <Text style={styles.addChildIcon}>+</Text>
              <Text style={styles.addChildText}>Connect Another Child</Text>
            </TouchableOpacity>
          </>
        ) : (
          /* Empty State */
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👨‍👩‍👧‍👦</Text>
            <Text style={styles.emptyTitle}>No Children Connected</Text>
            <Text style={styles.emptyDescription}>
              Connect your children to view their school information and make payments.
            </Text>
            <TouchableOpacity
              style={styles.connectFirstChildButton}
              onPress={handleAddChild}
              activeOpacity={0.8}
            >
              <Text style={styles.connectFirstChildText}>Connect Your First Child</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
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
  header: {
    padding: 16,
    paddingTop: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  scrollContent: {
    padding: 16,
  },
  childrenList: {
    gap: 16,
  },
  childCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  avatarContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  childInfo: {
    flex: 1,
    marginRight: 80, // Space for avatar
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  schoolName: {
    fontSize: 14,
    color: '#0080FF',
    fontWeight: '600',
    marginBottom: 2,
  },
  gradeText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  studentId: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  paymentInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  lastPaymentLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  lastPaymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 2,
  },
  lastPaymentDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  noPaymentText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  permissionsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 6,
  },
  permissionBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  permissionText: {
    fontSize: 12,
  },
  primaryBadge: {
    backgroundColor: '#EEF2FF',
  },
  primaryText: {
    fontSize: 10,
    color: '#4F46E5',
    fontWeight: '600',
  },
  addChildButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addChildIcon: {
    fontSize: 24,
    color: '#0080FF',
    marginRight: 8,
  },
  addChildText: {
    fontSize: 16,
    color: '#0080FF',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  connectFirstChildButton: {
    backgroundColor: '#0080FF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  connectFirstChildText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});