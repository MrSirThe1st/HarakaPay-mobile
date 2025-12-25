import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WEB_API_URL } from '../../config/env';
import { supabase } from '../../config/supabase';
import { useI18n } from '../../hooks/useI18n';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import colors from '../../constants/colors';

interface PaymentHistoryScreenProps {
  navigation: any;
  route: {
    params: {
      student: {
        id: string;
        first_name?: string | null;
        last_name?: string | null;
      };
    };
  };
}

interface PaymentHistoryItem {
  id: string;
  payment_id: string;
  installment_number: number | null;
  installment_label: string | null;
  amount: number;
  status: string;
  payment_method: string;
  mpesa_transaction_id: string | null;
  category_name: string;
  description: string | null;
  payment_date: string;
  created_at: string;
}

export default function PaymentHistoryScreen({ navigation, route }: PaymentHistoryScreenProps) {
  const { student } = route.params || {};
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPaid, setTotalPaid] = useState(0);
  const { t } = useI18n('payment');

  useEffect(() => {
    if (student?.id) {
      loadPaymentHistory();
    }
  }, [student?.id]);

  const loadPaymentHistory = async () => {
    if (!student?.id) return;

    try {
      setLoading(true);
      setError(null);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError('Please log in again');
        return;
      }

      const response = await fetch(
        `${WEB_API_URL}/api/parent/payment-history?studentId=${student.id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to load payment history');
      }

      const data = await response.json();
      setPayments(data.payments || []);
      setTotalPaid(data.total_paid || 0);
    } catch (err: any) {
      console.error('Error loading payment history:', err);
      setError(err.message || 'Failed to load payment history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPaymentHistory();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'failed':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'mobile_money':
        return t('history.method.mobileMoney');
      case 'airtel_money':
        return t('history.method.airtelMoney');
      case 'orange_money':
        return t('history.method.orangeMoney');
      default:
        return method || t('history.method.unknown');
    }
  };

  if (loading && payments.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} style={{ transform: [{ scale: 2 }] }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>{t('history.totalPayments')}</Text>
              <Text style={styles.summaryValue}>{payments.length}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View>
              <Text style={styles.summaryLabel}>{t('history.totalAmountPaid')}</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalPaid)}</Text>
            </View>
          </View>
        </View>

        {/* Student Info */}
        {student && (
          <View style={styles.studentCard}>
            <Ionicons name="person" size={20} color="#3B82F6" />
            <Text style={styles.studentName}>
              {student.first_name} {student.last_name}
            </Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle" size={24} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadPaymentHistory}>
              <Text style={styles.retryButtonText}>{t('common:buttons.retry')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Payment List */}
        {!error && payments.length > 0 ? (
          <View style={styles.paymentsList}>
            <Text style={styles.sectionTitle}>{t('history.allTransactions')}</Text>
            {payments.map((payment) => (
              <View key={payment.id} style={styles.paymentCard}>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentCategory}>{payment.category_name}</Text>
                    {payment.installment_label && (
                      <Text style={styles.paymentInstallment}>{payment.installment_label}</Text>
                    )}
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(payment.status)}20` }]}>
                    <Ionicons 
                      name={getStatusIcon(payment.status) as any} 
                      size={16} 
                      color={getStatusColor(payment.status)} 
                    />
                    <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.paymentAmountRow}>
                  <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
                </View>

                <View style={styles.paymentDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="card" size={16} color="#6B7280" />
                    <Text style={styles.detailLabel}>{t('history.paymentMethod')}:</Text>
                    <Text style={styles.detailValue}>{getPaymentMethodLabel(payment.payment_method)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color="#6B7280" />
                    <Text style={styles.detailLabel}>{t('history.paymentDate')}:</Text>
                    <Text style={styles.detailValue}>{formatDateTime(payment.payment_date)}</Text>
                  </View>
                  {payment.mpesa_transaction_id && (
                    <View style={styles.detailRow}>
                      <Ionicons name="receipt" size={16} color="#6B7280" />
                      <Text style={styles.detailLabel}>{t('history.transactionId')}:</Text>
                      <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="middle">
                        {payment.mpesa_transaction_id}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : !error ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>{t('history.noHistory')}</Text>
            <Text style={styles.emptyStateText}>
              {t('history.noHistoryDescription')}
            </Text>
          </View>
        ) : null}
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
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#2C67A6',
  },
  summaryLabel: {
    fontSize: 14,
    color: 'white',
    fontWeight:"bold",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  paymentsList: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  paymentCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  paymentInstallment: {
    fontSize: 14,
    color: '#B0C4DE',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paymentAmountRow: {
    borderTopWidth: 1,
    borderTopColor: '#2C67A6',
    paddingTop: 12,
    marginBottom: 12,
  },
  paymentAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
  },
  paymentDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#B0C4DE',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: 'white',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});

