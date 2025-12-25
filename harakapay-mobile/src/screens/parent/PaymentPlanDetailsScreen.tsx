import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PaymentScheduleItem } from '../../api/paymentApi';
import { WEB_API_URL } from '../../config/env';
import { supabase } from '../../config/supabase';
import colors from '../../constants/colors';
import { useI18n } from '../../hooks/useI18n';
import { formatCurrency as formatCurrencyUtil } from '../../utils/formatters';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7; // 70% of screen width - narrower cards
const CARD_SPACING = 16;

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
  const { t, currentLanguage } = useI18n('payment');
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paidInstallments, setPaidInstallments] = useState<Set<number>>(new Set());
  const [paidAmount, setPaidAmount] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);

  // Safety check - if params are missing, go back
  if (!plan || !category || !student) {
    console.log('❌ PaymentPlanDetailsScreen - Missing params, going back');
    navigation.goBack();
    return null;
  }

  const formatCurrency = (amount: number) => {
    return formatCurrencyUtil(amount, currentLanguage);
  };

  const formatDate = (dateString: string) => {
    const locale = currentLanguage === 'fr' ? 'fr-FR' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  const getPlanSubtitle = (plan: PaymentScheduleItem) => {
    const count = plan.installments?.length || 0;
    if (plan.schedule_type === 'upfront') {
      return t('details.payEverythingAtOnce');
    } else {
      return count === 1 ? t('details.installments', { count }) : t('details.installments_plural', { count });
    }
  };

  const translateInstallmentName = (name: string) => {
    // Handle "Full Payment"
    if (name.toLowerCase().includes('full payment')) {
      return t('details.fullPayment');
    }

    // Handle "Installment 1", "Installment 2", etc.
    const installmentMatch = name.match(/installment\s+(\d+)/i);
    if (installmentMatch) {
      return t('details.installment', { number: installmentMatch[1] });
    }

    // Handle "Monthly 1", "Monthly 2", etc.
    const monthlyMatch = name.match(/monthly\s+(\d+)/i);
    if (monthlyMatch) {
      return t('details.monthlyInstallment', { number: monthlyMatch[1] });
    }

    // Handle "Term 1", "Term 2", etc.
    const termMatch = name.match(/term\s+(\d+)/i);
    if (termMatch) {
      return t('details.termlyInstallment', { number: termMatch[1] });
    }

    // If no pattern matches, return the original name
    return name;
  };

  const getTotalAmount = () => {
    // Calculate total for THIS category only (not the entire fee structure)
    if (plan.schedule_type === 'upfront') {
      return category.amount * (1 - (plan.discount_percentage || 0) / 100);
    } else {
      return plan.installments?.reduce((total, installment) => total + installment.amount, 0) || 0;
    }
  };

  // Fetch paid installments
  const fetchPaidInstallments = async () => {
    if (!plan?.id || !student?.id) return;
    
    try {
      setIsLoadingPayments(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.warn('No session token available');
        return;
      }

      const response = await fetch(
        `${WEB_API_URL}/api/parent/paid-installments?studentId=${student.id}&paymentPlanId=${plan.id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error('Failed to fetch paid installments:', response.status);
        return;
      }

      const data = await response.json();
      const paidSet = new Set<number>();
      
      if (data.paid_installments && Array.isArray(data.paid_installments)) {
        data.paid_installments.forEach((paid: any) => {
          if (paid.installment_number) {
            paidSet.add(paid.installment_number);
          }
        });
      }

      setPaidInstallments(paidSet);
      setPaidAmount(data.paid_amount || 0);
      // Use remaining_balance from API, or calculate if not provided
      const calculatedRemaining = (data.total_due || getTotalAmount()) - (data.paid_amount || 0);
      setRemainingBalance(data.remaining_balance !== undefined ? data.remaining_balance : calculatedRemaining);
    } catch (error) {
      console.error('Error fetching paid installments:', error);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  // Fetch paid installments on mount and when screen comes into focus
  useEffect(() => {
    fetchPaidInstallments();
  }, [plan?.id, student?.id]);

  // Refresh when screen comes into focus (after payment)
  useFocusEffect(
    React.useCallback(() => {
      fetchPaidInstallments();
    }, [plan?.id, student?.id])
  );

  const getSavings = () => {
    if (plan.discount_percentage && plan.discount_percentage > 0) {
      return category.amount - getTotalAmount();
    }
    return 0;
  };

  const handleMakePayment = (installment?: any) => {
    console.log('Make payment for plan:', plan.id, 'installment:', installment);

    navigation.navigate('Payments', {
      student: student,
      paymentPlan: plan,
      selectedInstallment: installment || null, 
      feeAssignment: null 
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

  // Find the current installment index (closest to today, not overdue, not paid)
  const getCurrentInstallmentIndex = () => {
    if (!plan.installments || plan.installments.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find the first unpaid installment that is not overdue
    let currentIndex = 0;
    for (let i = 0; i < plan.installments.length; i++) {
      const installment = plan.installments[i];
      const isPaid = paidInstallments.has(installment.installment_number);
      
      if (isPaid) continue; // Skip paid installments
      
      const dueDate = new Date(installment.due_date);
      dueDate.setHours(0, 0, 0, 0);
      
      if (dueDate >= today) {
        currentIndex = i;
        break;
      }
      currentIndex = i; // Keep track of the last unpaid one if all are overdue
    }
    
    return currentIndex;
  };

  // Scroll to current installment on mount - center it in the screen
  // Wait for paid installments to load before scrolling
  useEffect(() => {
    if (plan.installments && plan.installments.length > 0 && !isLoadingPayments) {
      const index = getCurrentInstallmentIndex();
      setCurrentIndex(index);

      // Delay scroll to ensure layout is complete
      setTimeout(() => {
        // Calculate the correct offset to center the card
        const offset = index * (CARD_WIDTH + CARD_SPACING);
        flatListRef.current?.scrollToOffset({
          offset: offset,
          animated: true,
        });
      }, 300);
    }
  }, [plan.installments, paidInstallments, isLoadingPayments]);

  // Calculate snap offsets for perfect centering
  const getSnapOffsets = () => {
    if (!plan.installments) return [];
    return plan.installments.map((_, index) => {
      return index * (CARD_WIDTH + CARD_SPACING);
    });
  };

  const renderInstallmentCard = ({ item, index }: { item: any; index: number }) => {
    const isCurrent = index === currentIndex;
    const isPaid = paidInstallments.has(item.installment_number);
    const isDisabled = isPaid;

    return (
      <TouchableOpacity
        style={[
          styles.carouselCard, 
          isCurrent && styles.carouselCardActive,
          isDisabled && styles.carouselCardPaid
        ]}
        onPress={() => !isDisabled && handleMakePayment(item)}
        activeOpacity={isDisabled ? 1 : 0.8}
        disabled={isDisabled}
      >
        <View style={styles.carouselCardContent}>


          {/* Month/Label - Most Prominent */}
          <Text style={[styles.carouselInstallmentLabel, isCurrent && styles.carouselInstallmentLabelActive]}>
            {translateInstallmentName(item.name)}
          </Text>

          {/* Amount - Second Most Prominent */}
          <Text style={[styles.carouselInstallmentAmount, isCurrent && styles.carouselInstallmentAmountActive]}>
            {formatCurrency(item.amount)}
          </Text>

          {/* Status Badge */}
          <View style={styles.carouselStatusContainer}>
            {isPaid ? (
              <View style={styles.carouselPaidBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <Text style={styles.carouselPaidText}>{t('details.statusBadges.paid')}</Text>
              </View>
            ) : isOverdue(item.due_date) ? (
              <View style={styles.carouselOverdueBadge}>
                <Ionicons name="warning" size={14} color="#FCA5A5" />
                <Text style={styles.carouselOverdueText}>{t('details.statusBadges.overdue')}</Text>
              </View>
            ) : isUpcoming(item.due_date) ? (
              <View style={styles.carouselUpcomingBadge}>
                <Ionicons name="time" size={14} color="#FCD34D" />
                <Text style={styles.carouselUpcomingText}>{t('details.statusBadges.dueSoon')}</Text>
              </View>
            ) : (
              <View style={styles.carouselPendingBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#6EE7B7" />
                <Text style={styles.carouselPendingText}>{t('details.statusBadges.pending')}</Text>
              </View>
            )}
          </View>

          {/* Due Date */}
          <View style={styles.carouselDueDateContainer}>
            <Ionicons name="calendar-outline" size={14} color={isCurrent ? '#E0E7FF' : colors.text.secondary} style={styles.carouselCalendarIcon} />
            <View>
              <Text style={[styles.carouselDueDateLabel, isCurrent && styles.carouselDueDateLabelActive]}>
                {t('details.dueDate')}
              </Text>
              <Text style={[
                styles.carouselDueDateValue,
                isCurrent && styles.carouselDueDateValueActive,
                isOverdue(item.due_date) ? styles.carouselOverdueDate : null
              ]}>
                {formatDate(item.due_date)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
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
              <Text style={styles.amountLabel}>{t('details.originalAmount')}</Text>
              <Text style={styles.amountValue}>{formatCurrency(category.amount)}</Text>
            </View>
            {plan.discount_percentage && plan.discount_percentage > 0 ? (
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>{t('details.discount', { percent: plan.discount_percentage })}</Text>
                <Text style={styles.discountValue}>-{formatCurrency(getSavings())}</Text>
              </View>
            ) : null}
            <View style={[styles.amountRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>{t('details.totalAmount')}</Text>
              <Text style={styles.totalValue}>{formatCurrency(getTotalAmount())}</Text>
            </View>
            {paidAmount > 0 && (
              <>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>{t('details.amountPaid')}</Text>
                  <Text style={styles.paidValue}>{formatCurrency(paidAmount)}</Text>
                </View>
                <View style={[styles.amountRow, styles.remainingRow]}>
                  <Text style={styles.remainingLabel}>{t('details.remainingBalance')}</Text>
                  <Text style={styles.remainingValue}>{formatCurrency(remainingBalance)}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Installment Timeline - Horizontal Carousel */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>{t('details.paymentSchedule')}</Text>
          {plan.installments && plan.installments.length > 0 ? (
            <View style={styles.carouselContainer}>
              <FlatList
                ref={flatListRef}
                data={plan.installments}
                renderItem={renderInstallmentCard}
                keyExtractor={(item) => item.installment_number.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToOffsets={getSnapOffsets()}
                decelerationRate="fast"
                contentContainerStyle={styles.carouselContent}
                onScrollToIndexFailed={(info) => {
           
                  const wait = new Promise(resolve => setTimeout(resolve, 500));
                  wait.then(() => {
                    flatListRef.current?.scrollToIndex({
                      index: info.index,
                      animated: true,
                    });
                  });
                }}
                onMomentumScrollEnd={(event) => {
                  const scrollX = event.nativeEvent.contentOffset.x;
                  const paddingLeft = (width - CARD_WIDTH) / 2;
                  const adjustedScrollX = scrollX + paddingLeft;
                  const index = Math.round(adjustedScrollX / (CARD_WIDTH + CARD_SPACING));
                  const clampedIndex = Math.max(0, Math.min(index, (plan.installments?.length || 1) - 1));
                  setCurrentIndex(clampedIndex);
                }}
                getItemLayout={(_, index) => ({
                  length: CARD_WIDTH + CARD_SPACING,
                  offset: (CARD_WIDTH + CARD_SPACING) * index,
                  index,
                })}
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={colors.text.caption} />
              <Text style={styles.emptyStateText}>{t('details.emptyState.noInstallments')}</Text>
            </View>
          )}
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <View style={styles.helpCard}>
            <Ionicons name="information-circle" size={20} color="#6B7280" />
            <Text style={styles.helpText}>
              {plan.schedule_type === 'upfront'
                ? t('details.helpText.upfront')
                : t('details.helpText.installments')
              }
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
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {

    borderRadius: 16,
    padding: 18,
    marginBottom: 18,

  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
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
    fontSize: 22,
    fontWeight: '700',

    marginBottom: 6,
  },
  summarySubtitle: {
    fontSize: 16,

  },
  summaryAmounts: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 20,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 12,
    marginTop: 12,
  },
  amountLabel: {
    fontSize: 16,

  },
  amountValue: {
    fontSize: 17,

    fontWeight: '600',
  },
  discountValue: {
    fontSize: 17,
    color: '#10B981',
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',

  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700',

  },
  timelineSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  carouselContainer: {
    height: 300,
    marginHorizontal: -16, // Offset padding to allow full-width cards
  },
  carouselContent: {
    paddingLeft: (width - CARD_WIDTH) / 2, // Center first item
    paddingRight: (width - CARD_WIDTH) / 2, // Center last item
    paddingVertical: 12,
  },
  carouselCard: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    transform: [{ scale: 0.95 }],
    borderWidth: 1,
    borderColor: colors.border,
  },
  carouselCardActive: {
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.blue.light,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1 }],
  },
  carouselCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselBadgeContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  carouselInstallmentNumber: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  carouselInstallmentNumberActive: {
    backgroundColor: '#60A5FA',
    borderColor: '#93C5FD',
  },
  carouselInstallmentNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#93C5FD',
    letterSpacing: 0.5,
  },
  carouselInstallmentNumberTextActive: {
    color: 'white',
  },
  carouselInstallmentLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  carouselInstallmentLabelActive: {
    fontSize: 22,
    color: 'white',
  },
  carouselInstallmentAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  carouselInstallmentAmountActive: {
    fontSize: 32,
    color: 'white',
  },
  carouselDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 12,
  },
  carouselStatusContainer: {
    marginBottom: 12,
  },
  carouselOverdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  carouselOverdueText: {
    fontSize: 11,
    color: '#FCA5A5',
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  carouselUpcomingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  carouselUpcomingText: {
    fontSize: 11,
    color: '#FCD34D',
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  carouselPendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  carouselPendingText: {
    fontSize: 11,
    color: '#6EE7B7',
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  carouselCardPaid: {
    opacity: 0.7,
    backgroundColor: '#F9FAFB',
  },
  carouselPaidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  carouselPaidText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  paidValue: {
    fontSize: 17,
    color: '#10B981',
    fontWeight: '600',
  },
  remainingRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
    marginTop: 12,
  },
  remainingLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FCD34D',
  },
  remainingValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FCD34D',
  },
  carouselDueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  carouselCalendarIcon: {
    marginRight: 8,
  },
  carouselDueDateLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  carouselDueDateLabelActive: {
    color: '#E0E7FF',
  },
  carouselDueDateValue: {
    fontSize: 13,
    color: colors.text.primary,
    fontWeight: '600',
  },
  carouselDueDateValueActive: {
    color: 'white',
    fontSize: 14,
  },
  carouselOverdueDate: {
    color: '#FCA5A5',
    fontWeight: '700',
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
    color: colors.text.caption,
    marginTop: 16,
    textAlign: 'center',
  },
});
