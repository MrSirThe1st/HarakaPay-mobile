import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '../../config/supabase';

interface RouteParams {
  paymentId: string;
  studentName?: string;
  amount?: number;
  transactionId?: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  transaction_reference: string | null;
  payment_gateway_response: any;
  created_at: string;
  updated_at: string;
  description: string | null;
}

export default function PaymentStatusScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params as RouteParams;

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentStatus();

    // Poll for status updates every 5 seconds for pending payments
    const interval = setInterval(() => {
      if (payment?.status === 'pending') {
        fetchPaymentStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [params.paymentId, payment?.status]);

  const fetchPaymentStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', params.paymentId)
        .single();

      if (error) throw error;

      setPayment(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching payment status:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'failed':
        return '❌';
      default:
        return '❓';
    }
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading payment status...</Text>
      </View>
    );
  }

  if (error || !payment) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error || 'Payment not found'}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statusCard}>
        <Text style={styles.statusIcon}>{getStatusIcon(payment.status)}</Text>
        <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
          {payment.status.toUpperCase()}
        </Text>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Payment Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>${payment.amount.toFixed(2)}</Text>
        </View>

        {params.studentName && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Student:</Text>
            <Text style={styles.value}>{params.studentName}</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text style={styles.value}>
            {payment.payment_method === 'mobile_money' ? 'M-Pesa' : payment.payment_method}
          </Text>
        </View>

        {payment.transaction_reference && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Transaction ID:</Text>
            <Text style={styles.valueSmall}>{payment.transaction_reference}</Text>
          </View>
        )}

        {payment.description && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{payment.description}</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.label}>Created:</Text>
          <Text style={styles.value}>
            {new Date(payment.created_at).toLocaleString()}
          </Text>
        </View>
      </View>

      {payment.status === 'pending' && (
        <View style={styles.pendingCard}>
          <ActivityIndicator size="small" color="#F59E0B" />
          <Text style={styles.pendingText}>
            Waiting for M-Pesa confirmation...{'\n'}
            This may take a few minutes.
          </Text>
        </View>
      )}

      {payment.status === 'failed' && payment.payment_gateway_response && (
        <View style={styles.errorCard}>
          <Text style={styles.errorCardTitle}>Error Details</Text>
          <Text style={styles.errorCardText}>
            {payment.payment_gateway_response.responseDesc || 'Payment failed'}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {payment.status === 'failed' && (
          <TouchableOpacity
            style={[styles.button, styles.retryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Tabs', { screen: 'Payments' })}
        >
          <Text style={styles.buttonText}>
            {payment.status === 'completed' ? 'View All Payments' : 'Back to Payments'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 8,
  },
  valueSmall: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 8,
  },
  pendingCard: {
    backgroundColor: '#FFFBEB',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 8,
  },
  errorCardText: {
    fontSize: 14,
    color: '#7F1D1D',
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
