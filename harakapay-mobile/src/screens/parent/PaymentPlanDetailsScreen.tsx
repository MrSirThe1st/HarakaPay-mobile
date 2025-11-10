import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PaymentScheduleItem } from '../../api/paymentApi';
import colors from '../../constants/colors';

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
}

interface FeeCategory {
  id: string;
  name: string;
  amount: number;
  is_mandatory: boolean;
  is_recurring: boolean;
  payment_modes: string[];
}

interface PaymentPlanDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      plan: PaymentScheduleItem;
      category: FeeCategory;
      student: any;
    };
  };
}

export default function PaymentPlanDetailsScreen({ navigation, route }: PaymentPlanDetailsScreenProps) {
  const { plan, category, student } = route.params || {};

  // Safety check - if params are missing, go back
  if (!plan || !category || !student) {
    console.log('❌ PaymentPlanDetailsScreen - Missing params, going back');
    navigation.goBack();
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  const getPlanSubtitle = (plan: PaymentScheduleItem) => {
    if (plan.schedule_type === 'upfront') {
      return 'Pay everything at once';
    } else {
      return `${plan.installments?.length || 0} installments`;
    }
  };

  const getTotalAmount = () => {
    if (plan.schedule_type === 'upfront') {
      return category.amount * (1 - (plan.discount_percentage || 0) / 100);
    } else {
      return plan.installments?.reduce((total, installment) => total + installment.amount, 0) || 0;
    }
  };

  const getSavings = () => {
    if (plan.discount_percentage && plan.discount_percentage > 0) {
      return category.amount - getTotalAmount();
    }
    return 0;
  };

  const handleMakePayment = () => {
    console.log('Make payment for plan:', plan.id);
    // Navigate to PaymentsScreen with student and payment plan data
    navigation.navigate('Payments', {
      student: student,
      paymentPlan: plan,
      feeAssignment: null // Will be loaded in PaymentsScreen
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const isUpcoming = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}


      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Plan Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIconContainer}>
              <Ionicons 
                name={plan.schedule_type === 'upfront' ? 'card' : 'calendar'} 
                size={32} 
                color={plan.schedule_type === 'upfront' ? '#10B981' : '#3B82F6'} 
              />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryTitle}>{getPlanTitle(plan.schedule_type)}</Text>
              <Text style={styles.summarySubtitle}>{getPlanSubtitle(plan)}</Text>
            </View>
          </View>
          
          <View style={styles.summaryAmounts}>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Original Amount:</Text>
              <Text style={styles.amountValue}>{formatCurrency(category.amount)}</Text>
            </View>
            {plan.discount_percentage && plan.discount_percentage > 0 ? (
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Discount ({plan.discount_percentage}%):</Text>
                <Text style={styles.discountValue}>-{formatCurrency(getSavings())}</Text>
              </View>
            ) : null}
            <View style={[styles.amountRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>{formatCurrency(getTotalAmount())}</Text>
            </View>
          </View>
        </View>

        {/* Installment Timeline */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Payment Schedule</Text>
          {plan.installments && plan.installments.length > 0 ? (
            plan.installments.map((installment, index) => (
            <View key={installment.installment_number} style={styles.installmentCard}>
              <View style={styles.installmentHeader}>
                <View style={styles.installmentNumber}>
                  <Text style={styles.installmentNumberText}>
                    {installment.installment_number}
                  </Text>
                </View>
                <View style={styles.installmentInfo}>
                  <Text style={styles.installmentLabel}>{installment.name}</Text>
                  <Text style={styles.installmentAmount}>
                    {formatCurrency(installment.amount)}
                  </Text>
                </View>
                <View style={styles.installmentStatus}>
                  {isOverdue(installment.due_date) ? (
                    <View style={styles.overdueBadge}>
                      <Ionicons name="warning" size={16} color="#EF4444" />
                      <Text style={styles.overdueText}>Overdue</Text>
                    </View>
                  ) : isUpcoming(installment.due_date) ? (
                    <View style={styles.upcomingBadge}>
                      <Ionicons name="time" size={16} color="#F59E0B" />
                      <Text style={styles.upcomingText}>Due Soon</Text>
                    </View>
                  ) : (
                    <View style={styles.pendingBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={styles.pendingText}>Pending</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.installmentDetails}>
                <Text style={styles.dueDateLabel}>Due Date:</Text>
                <Text style={[
                  styles.dueDateValue,
                  isOverdue(installment.due_date) ? styles.overdueDate : null
                ]}>
                  {formatDate(installment.due_date)}
                </Text>
              </View>
            </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateText}>No installments available</Text>
            </View>
          )}
        </View>

        {/* Payment Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.payButton} onPress={handleMakePayment}>
            <Ionicons name="card" size={20} color="white" />
            <Text style={styles.payButtonText}>Make Payment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.scheduleButton}>
            <Ionicons name="calendar" size={20} color="#3B82F6" />
            <Text style={styles.scheduleButtonText}>Schedule Payment</Text>
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <View style={styles.helpCard}>
            <Ionicons name="information-circle" size={20} color="#6B7280" />
            <Text style={styles.helpText}>
              {plan.schedule_type === 'upfront' 
                ? 'Pay the full amount by the due date to receive your discount.'
                : 'Make payments according to the schedule above. Late payments may incur additional fees.'
              }
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
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 16,
    color: '#B0C4DE',
  },
  summaryAmounts: {
    borderTopWidth: 1,
    borderTopColor: '#2C67A6',
    paddingTop: 16,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#2C67A6',
    paddingTop: 12,
    marginTop: 8,
  },
  amountLabel: {
    fontSize: 16,
    color: '#B0C4DE',
  },
  amountValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  discountValue: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  timelineSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  installmentCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  installmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  installmentNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  installmentNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  installmentInfo: {
    flex: 1,
  },
  installmentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  installmentAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  installmentStatus: {
    alignItems: 'flex-end',
  },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  overdueText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
    marginLeft: 4,
  },
  upcomingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  upcomingText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
    marginLeft: 4,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pendingText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
    marginLeft: 4,
  },
  installmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateLabel: {
    fontSize: 14,
    color: '#B0C4DE',
  },
  dueDateValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  overdueDate: {
    color: '#EF4444',
    fontWeight: '600',
  },
  actionsSection: {
    marginBottom: 24,
  },
  payButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  scheduleButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  scheduleButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  },
});
