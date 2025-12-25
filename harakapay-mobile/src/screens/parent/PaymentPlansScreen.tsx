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
import colors from '../../constants/colors';
import { useI18n } from '../../hooks/useI18n';
import { formatCurrency } from '../../utils/formatters';

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
  console.log('PaymentPlansScreen route:', route);
  console.log('PaymentPlansScreen params:', route?.params);
  console.log('PaymentPlansScreen params keys:', route?.params ? Object.keys(route.params) : 'no params');

  const { t, currentLanguage } = useI18n('payment');
  const { category, student, feeStructure } = route.params || {};
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usedPaymentPlanId, setUsedPaymentPlanId] = useState<string | null>(null);

  // Safety check for missing params
  if (!category || !student || !feeStructure) {
    console.log('Missing params:', { category, student, feeStructure });
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#EF4444"/>
          <Text style={styles.errorTitle}>{t('plans.errors.missingInfo')}</Text>
          <Text style={styles.errorText}>{t('plans.errors.missingInfoDescription')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Additional safety check for category amount
  if (!category.amount) {
    console.log('Category amount is missing:', category);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#EF4444"/>
          <Text style={styles.errorTitle}>{t('plans.errors.invalidCategory')}</Text>
          <Text style={styles.errorText}>{t('plans.errors.invalidCategoryDescription')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    if (feeStructure?.id) {
      loadPaymentPlans();
      loadUsedPaymentPlan();
    } else {
      setError('Fee structure information is missing');
      setLoading(false);
    }
  }, [feeStructure]);

  // Load which payment plan has been used
  const loadUsedPaymentPlan = async () => {
    if (!student?.id || !category?.id) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const response = await fetch(
        `${WEB_API_URL}/api/parent/used-payment-plan?studentId=${student.id}&categoryId=${category.id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.used_payment_plan_id) {
          setUsedPaymentPlanId(data.used_payment_plan_id);
        }
      }
    } catch (error) {
      console.error('Error loading used payment plan:', error);
    }
  };

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
        const allPaymentPlans = studentData.payment_schedules?.map((schedule: any) => ({
          id: schedule.id,
          type: schedule.schedule_type, // This comes from payment_plans.type column
          discount_percentage: schedule.discount_percentage || 0,
          currency: 'USD', // Default currency
          installments: schedule.installments || [],
          fee_category_id: schedule.fee_category_id || null, // New: link to fee category
          is_active: true,
          created_at: new Date().toISOString()
        })) || [];

        console.log('🔍 All payment plans:', allPaymentPlans.length);
        console.log('🎯 Category ID:', category.id);
        console.log('📦 Category:', category.name, category.category_type);

        // Filter payment plans by fee_category_id
        const categoryPaymentPlans = allPaymentPlans.filter((plan: any) => {
          const matches = plan.fee_category_id === category.id;
          console.log(`  Plan ${plan.type}: category_id=${plan.fee_category_id}, matches=${matches}`);
          return matches;
        });

        console.log('✅ Filtered payment plans for category:', categoryPaymentPlans.length);

        if (categoryPaymentPlans.length === 0) {
          console.warn('⚠️ No payment plans found matching this category. Showing empty state.');
        }

        setPaymentPlans(categoryPaymentPlans);
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
    // Check if this plan is disabled
    const isDisabled = usedPaymentPlanId !== null && usedPaymentPlanId !== plan.id;
    
    if (isDisabled) {
      return; // Don't navigate if disabled
    }

    navigation.navigate('PaymentPlanDetails', {
      plan,
      category,
      student,
    });
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
      case 'upfront': return t('plans.upfront.title');
      case 'monthly': return t('plans.monthly.title');
      case 'per-term': return t('plans.termly.title');
      case 'custom': return t('plans.custom.title');
      default: return t('plans.default.title');
    }
  };

  const getPlanDescription = (plan: PaymentPlan) => {
    const count = plan.installments?.length || 0;
    switch (plan.type) {
      case 'upfront':
        return plan.discount_percentage
          ? t('plans.upfront.shortDescriptionWithDiscount', { percent: plan.discount_percentage })
          : t('plans.upfront.shortDescription');
      case 'monthly':
        return t('plans.monthly.shortDescription', { count });
      case 'per-term':
        return t('plans.termly.shortDescription', { count });
      case 'custom':
        return t('plans.custom.shortDescription', { count });
      default:
        return t('plans.default.description');
    }
  };

  const getPlanAmount = (plan: PaymentPlan) => {
    if (plan.type === 'upfront') {
      return formatCurrency((category?.amount || 0) * (1 - (plan.discount_percentage || 0) / 100), currentLanguage);
    } else {
      const firstInstallment = plan.installments?.[0];
      return firstInstallment ? formatCurrency(firstInstallment.amount || 0, currentLanguage) : 'N/A';
    }
  };

  const getPlanSubAmount = (plan: PaymentPlan) => {
    if (plan.type === 'upfront') {
      return `${t('plans.totalAmount')}: ${formatCurrency((category?.amount || 0) * (1 - (plan.discount_percentage || 0) / 100), currentLanguage)}`;
    } else {
      const period = plan.type === 'monthly' ? t('plans.periods.monthly') :
                    plan.type === 'per-term' ? t('plans.periods.perTerm') :
                    plan.type === 'custom' ? t('plans.periods.perInstallment') : t('plans.periods.perPayment');
      return `${period.charAt(0).toUpperCase() + period.slice(1)}: ${getPlanAmount(plan)}`;
    }
  };

  const getDueDate = (plan: PaymentPlan) => {
    if (plan.type === 'upfront') {
      const firstInstallment = plan.installments?.[0];
      return firstInstallment?.due_date ? `${t('plans.dueBy')}: ${new Date(firstInstallment.due_date).toLocaleDateString()}` : '';
    } else {
      const firstInstallment = plan.installments?.[0];
      return firstInstallment?.due_date ? `${t('plans.firstDue')}: ${new Date(firstInstallment.due_date).toLocaleDateString()}` : '';
    }
  };

  const getPlanExplanation = (plan: PaymentPlan) => {
    switch (plan.type) {
      case 'upfront':
        return t('plans.upfront.description');
      case 'monthly':
        return t('plans.monthly.description');
      case 'per-term':
        return t('plans.termly.description');
      case 'custom':
        return t('plans.custom.description');
      default:
        return t('plans.default.description');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} style={{ transform: [{ scale: 2 }] }} />

        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>{t('plans.errors.loadFailed')}</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadPaymentPlans}>
            <Text style={styles.retryButtonText}>{t('plans.errors.retryButton')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Summary */}      
        {/* Payment Plans */}
        <View style={styles.plansSection}>

          {paymentPlans.length > 0 ? (
            paymentPlans.map((plan) => {
              const isUsed = usedPaymentPlanId === plan.id;
              const isDisabled = usedPaymentPlanId !== null && usedPaymentPlanId !== plan.id;

              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    isDisabled && styles.planCardDisabled
                  ]}
                  onPress={() => handlePlanPress(plan)}
                  disabled={isDisabled}
                  activeOpacity={isDisabled ? 1 : 0.7}
                >
                  <View style={styles.planHeader}>
                    <View style={styles.planIconContainer}>
                      <Ionicons
                        name={getPlanIcon(plan.type)}
                        size={26}
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

                  {plan.discount_percentage && plan.discount_percentage > 0 ? (
                    <View style={styles.discountBadge}>
                      <Ionicons name="gift" size={16} color="#10B981" />
                      <Text style={styles.discountText}>
                        {t('plans.discount', { percent: plan.discount_percentage || 0 })}
                      </Text>
                    </View>
                  ) : null}

                  {isUsed && (
                    <View style={styles.usedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={styles.usedBadgeText}>{t('plans.currentlyUsing')}</Text>
                    </View>
                  )}

                  {/* Separator and Explanation */}
                  <View style={styles.separator} />
                  <View style={styles.explanationSection}>
                    <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
                    <Text style={styles.explanationText}>{getPlanExplanation(plan)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateText}>{t('plans.emptyState.title')}</Text>
              <Text style={styles.emptyStateSubtext}>{t('plans.emptyState.description')}</Text>
            </View>
          )}
        </View>

        {/* Help Text */}
        <View style={styles.helpSection}>
          <View style={styles.helpCard}>
            <Ionicons name="information-circle" size={20} color="#6B7280" />
            <Text style={styles.helpText}>
              {t('plans.helpText')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  content: {
    flex: 1,
    padding: 16,
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
    color: 'white',
    marginBottom: 4,
  },
  categoryAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  remainingAmountText: {
    fontSize: 14,
    color: '#B0C4DE',
    marginTop: 2,
  },
  categoryBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  mandatoryBadge: {
    backgroundColor: '#2C67A6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  mandatoryText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  recurringBadge: {
    backgroundColor: '#2C67A6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  recurringText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  oneTimeBadge: {
    backgroundColor: '#2C67A6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  oneTimeText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  plansSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  planIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.blue.pale,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  planDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  planAmountContainer: {
    flex: 1,
  },
  planAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  planSubAmount: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  planDueDate: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  planCardDisabled: {
    opacity: 0.6,
    backgroundColor: '#F9FAFB',
  },
  usedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  usedBadgeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 6,
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  disabledText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  disabledSubtext: {
    fontSize: 12,
    color: '#E5E7EB',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  explanationSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.blue.pale,
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  explanationText: {
    flex: 1,
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
});
