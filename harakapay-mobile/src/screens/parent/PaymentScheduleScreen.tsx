import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { fetchStudentFeeCategories, FeeCategoryItem } from '../../api/paymentApi';
import colors from '../../constants/colors';

type PaymentScheduleRouteParams = {
  studentId?: string;
  categoryId?: string;
};

const PaymentScheduleScreen: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, PaymentScheduleRouteParams>, string>>();
  const studentId = route.params?.studentId;
  const categoryId = route.params?.categoryId;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<FeeCategoryItem | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!studentId || !categoryId) return;
      setLoading(true);
      setError(null);
      try {
        const categories = await fetchStudentFeeCategories(studentId);
        const foundCategory = categories.find(cat => cat.id === categoryId);
        if (mounted) setCategory(foundCategory || null);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load payment options');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [studentId, categoryId]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    // TODO: Navigate to payment processing with selected option
    console.log('Selected payment option:', option);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Payment Options</Text>
        {category && (
          <>
            <Text style={styles.categoryName}>{category.name}</Text>
            {category.description && (
              <Text style={styles.categoryDesc}>{category.description}</Text>
            )}
            <Text style={styles.amount}>Amount: {formatCurrency(category.amount)}</Text>
          </>
        )}

        {loading && (
          <View style={styles.centered}> 
            <ActivityIndicator size="large" color={colors.primary} style={{ transform: [{ scale: 2 }] }} />
          </View>
        )}

        {!!error && !loading && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !error && category && (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsTitle}>Select Payment Method:</Text>
            
            <View style={styles.optionsGrid}>
              {category.supports_one_time && (
                <TouchableOpacity 
                  style={[styles.optionButton, selectedOption === 'one-time' && styles.optionSelected]} 
                  activeOpacity={0.8}
                  onPress={() => handleOptionSelect('one-time')}
                >
                  <Text style={[styles.optionText, selectedOption === 'one-time' && styles.optionTextSelected]}>
                    One-time Payment
                  </Text>
                  <Text style={styles.optionAmount}>{formatCurrency(category.amount)}</Text>
                </TouchableOpacity>
              )}
              
              {category.supports_recurring && (
                <TouchableOpacity 
                  style={[styles.optionButton, selectedOption === 'recurring' && styles.optionSelected]} 
                  activeOpacity={0.8}
                  onPress={() => handleOptionSelect('recurring')}
                >
                  <Text style={[styles.optionText, selectedOption === 'recurring' && styles.optionTextSelected]}>
                    Recurring Payment
                  </Text>
                  <Text style={styles.optionSubtext}>Monthly installments</Text>
                </TouchableOpacity>
              )}
            </View>

            {selectedOption && (
              <TouchableOpacity style={styles.proceedButton} activeOpacity={0.8}>
                <Text style={styles.proceedButtonText}>Proceed with {selectedOption === 'one-time' ? 'One-time' : 'Recurring'} Payment</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {!loading && !error && !category && (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Category not found.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const formatCurrency = (value: number): string => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  categoryDesc: {
    fontSize: 14,
    color: '#B0C4DE',
    marginBottom: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    marginTop: 8,
    color: '#B0C4DE',
  },
  errorText: {
    color: '#EF4444',
  },
  emptyText: {
    color: '#B0C4DE',
  },
  optionsContainer: {
    flex: 1,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  optionsGrid: {
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  optionSelected: {
    borderColor: '#0080FF',
    backgroundColor: '#F0F8FF',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  optionTextSelected: {
    color: '#0080FF',
  },
  optionAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  optionSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  proceedButton: {
    backgroundColor: '#0080FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default PaymentScheduleScreen;
