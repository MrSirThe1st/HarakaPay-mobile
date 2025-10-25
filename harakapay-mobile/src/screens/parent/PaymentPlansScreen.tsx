import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FeeCategoryItem } from '../../api/paymentApi';
import { supabase } from '../../config/supabase';
import { WEB_API_URL } from '../../config/env';

const { width } = Dimensions.get('window');

interface PaymentPlan {
  id: string;
  type: 'monthly' | 'per-term' | 'upfront' | 'custom';
  discount_percentage: number;
  currency: string;
  installments: Array<{
    installment_number: number;
    label: string;
    amount: number;
    due_date: string;
  }>;
  is_active: boolean;
  created_at: string;
}

interface PaymentPlansScreenProps {
  navigation: any;
  route: {
    params: {
      category: FeeCategoryItem;
      student: any;
      feeStructure: any; // Add fee structure to params
    };
  };
}

export default function PaymentPlansScreen({ navigation, route }: PaymentPlansScreenProps) {
  const { category, student, feeStructure } = route.params || {};
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Safety check for missing params
  if (!category || !student || !feeStructure) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Missing Information</Text>
          <Text style={styles.errorText}>Required data is missing. Please go back and try again.</Text>
        </View>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    if (feeStructure?.id) {
      loadPaymentPlans();
    } else {
      setError('Fee structure information is missing');
      setLoading(false);
    }
  }, [feeStructure]);

  const loadPaymentPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get authentication token with refresh logic
      let { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.access_token) {
        console.log('No valid session, attempting to refresh...');
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !refreshedSession?.access_token) {
          console.error('Failed to refresh session:', refreshError);
          throw new Error('No authentication token available - please log in again');
        }
        
        session = refreshedSession;
      }

      // Use the parent API endpoint to get student fee details
      const response = await fetch(`${WEB_API_URL}/api/parent/student-fees-detailed`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch student fee details: ${response.status}`);
      }

      const data = await response.json();
      
      // Find the student's data to get the fee structure
      const studentData = data.student_fees?.find((s: any) => s?.student?.id === student.id);
      if (studentData?.fee_template?.id === feeStructure.id) {
        // Get payment plans assigned to this specific student
        // This shows only the payment plans that concern this student
        const studentPaymentPlans = studentData.payment_schedules?.map((schedule: any) => ({
          id: schedule.id,
          type: schedule.schedule_type, // This comes from payment_plans.type column
          discount_percentage: schedule.discount_percentage || 0,
          currency: 'USD', // Default currency
          installments: schedule.installments || [],
          is_active: true,
          created_at: new Date().toISOString()
        })) || [];
        
        console.log('Payment plans assigned to this student:', studentPaymentPlans);
        setPaymentPlans(studentPaymentPlans);
      } else {
        throw new Error('No payment plans found for this fee structure');
      }
    } catch (err) {
      console.error('Error loading payment plans:', err);
      setError(err instanceof Error ? err.message : 'Failed to load payment plans');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanPress = (plan: PaymentPlan) => {
    navigation.navigate('PaymentPlanDetails', {
      plan,
      category,
      student,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'upfront': return 'card';
      case 'monthly': return 'calendar';
      case 'per-term': return 'school';
      case 'custom': return 'list';
      default: return 'receipt';
    }
  };

  const getPlanTitle = (type: string) => {
    switch (type) {
      case 'upfront': return 'One-time Payment';
      case 'monthly': return 'Monthly Plan';
      case 'per-term': return 'Termly Plan';
      case 'custom': return 'Installment Plan';
      default: return 'Payment Plan';
    }
  };

  const getPlanDescription = (plan: PaymentPlan) => {
    switch (plan.type) {
      case 'upfront':
        return `Pay everything once${plan.discount_percentage ? ` and get ${plan.discount_percentage}% discount` : ''}`;
      case 'monthly':
        return `Pay over ${plan.installments?.length || 0} months`;
      case 'per-term':
        return `Pay over ${plan.installments?.length || 0} terms`;
      case 'custom':
        return `Pay over ${plan.installments?.length || 0} installments`;
      default:
        return 'Flexible payment option';
    }
  };

  const getPlanAmount = (plan: PaymentPlan) => {
    if (plan.type === 'upfront') {
      return formatCurrency(category.amount * (1 - (plan.discount_percentage || 0) / 100));
    } else {
      const firstInstallment = plan.installments?.[0];
      return firstInstallment ? formatCurrency(firstInstallment.amount) : 'N/A';
    }
  };

  const getPlanSubAmount = (plan: PaymentPlan) => {
    if (plan.type === 'upfront') {
      return `Total: ${formatCurrency(category.amount * (1 - (plan.discount_percentage || 0) / 100))}`;
    } else {
      const period = plan.type === 'monthly' ? 'monthly' : 
                    plan.type === 'per-term' ? 'per term' : 'per installment';
      return `${period.charAt(0).toUpperCase() + period.slice(1)}: ${getPlanAmount(plan)}`;
    }
  };

  const getDueDate = (plan: PaymentPlan) => {
    if (plan.type === 'upfront') {
      const firstInstallment = plan.installments?.[0];
      return firstInstallment ? `Due by: ${new Date(firstInstallment.due_date).toLocaleDateString()}` : '';
    } else {
      const firstInstallment = plan.installments?.[0];
      return firstInstallment ? `First due: ${new Date(firstInstallment.due_date).toLocaleDateString()}` : '';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading payment plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Unable to Load Payment Plans</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadPaymentPlans}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Payment Plans</Text>
          <Text style={styles.headerSubtitle}>{category.name}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Summary */}
        <View style={styles.categorySummary}>
          <View style={styles.categoryIconContainer}>
            <Ionicons name="receipt" size={32} color="#3B82F6" />
          </View>
          <View style={styles.categoryDetails}>
                <Text style={styles.categoryName}>{category.name || 'Unknown Category'}</Text>
                <Text style={styles.categoryAmount}>{formatCurrency(category.amount || 0)}</Text>
            <View style={styles.categoryBadges}>
              {category.is_mandatory === true && (
                <View style={styles.mandatoryBadge}>
                  <Text style={styles.mandatoryText}>Mandatory</Text>
                </View>
              )}
              {category.supports_recurring === true && (
                <View style={styles.recurringBadge}>
                  <Text style={styles.recurringText}>Recurring</Text>
                </View>
              )}
              {category.supports_one_time === true && (
                <View style={styles.oneTimeBadge}>
                  <Text style={styles.oneTimeText}>One-time</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Payment Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Available Payment Plans</Text>
          {paymentPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={styles.planCard}
              onPress={() => handlePlanPress(plan)}
            >
              <View style={styles.planHeader}>
                <View style={styles.planIconContainer}>
                  <Ionicons 
                    name={getPlanIcon(plan.type)} 
                    size={24} 
                    color={plan.type === 'upfront' ? '#10B981' : '#3B82F6'} 
                  />
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planTitle}>{getPlanTitle(plan.type || 'unknown')}</Text>
                  <Text style={styles.planDescription}>{getPlanDescription(plan)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
              
              <View style={styles.planDetails}>
                <View style={styles.planAmountContainer}>
                  <Text style={styles.planAmount}>{getPlanAmount(plan)}</Text>
                  <Text style={styles.planSubAmount}>{getPlanSubAmount(plan)}</Text>
                </View>
                <Text style={styles.planDueDate}>{getDueDate(plan)}</Text>
              </View>

              {plan.discount_percentage && plan.discount_percentage > 0 && (
                <View style={styles.discountBadge}>
                  <Ionicons name="gift" size={16} color="#10B981" />
                  <Text style={styles.discountText}>
                    {plan.discount_percentage}% discount
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Help Text */}
        <View style={styles.helpSection}>
          <View style={styles.helpCard}>
            <Ionicons name="information-circle" size={20} color="#6B7280" />
            <Text style={styles.helpText}>
              Select a payment plan to view detailed installment schedules and make payments.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categorySummary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  categoryAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 8,
  },
  categoryBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  mandatoryBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  mandatoryText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '500',
  },
  recurringBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  recurringText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
  oneTimeBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  oneTimeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F59E0B',
  },
  plansSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  planIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  planDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  planDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planAmountContainer: {
    flex: 1,
  },
  planAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  planSubAmount: {
    fontSize: 14,
    color: '#6B7280',
  },
  planDueDate: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
    marginLeft: 4,
  },
  helpSection: {
    marginBottom: 24,
  },
  helpCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
});
