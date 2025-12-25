import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FeeCategoryItem, PaymentScheduleItem } from '../../api/paymentApi';
import usePaymentData from '../../hooks/usePaymentData';
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

export default function FeeDetailsScreen({ navigation, route }: ChildDetailsScreenProps) {
  const { student } = route.params;
  
  // Use the new payment data hook with smart caching
  const {
    categories,
    paymentPlans,
    feeStructure,
    isLoading,
    error,
    hasCachedData,
    isCacheValid,
    refreshData,
    clearError,
  } = usePaymentData(student.id);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCategoryPress = (category: FeeCategoryItem) => {
    navigation.navigate('PaymentPlans', {
      category,
      student,
      feeStructure,
    });
  };

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('tuition')) return 'school';
    if (name.includes('transport')) return 'car';
    if (name.includes('book')) return 'book';
    if (name.includes('uniform')) return 'shirt';
    if (name.includes('meal') || name.includes('food')) return 'restaurant';
    return 'receipt';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTotalAmount = () => {
    return categories.reduce((total, category) => total + category.amount, 0);
  };

  if (isLoading && !hasCachedData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} style={{ transform: [{ scale: 2 }] }} />
        </View>
      </SafeAreaView>
    );
  }

  // Only show error screen for actual errors, not for missing data (which shows empty state)
  if (error && !hasCachedData && !error.includes('No fee data found')) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Unable to Load Fees</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
      >
        {/* Summary Card - Only show when there are categories */}
        {categories.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Fee Summary</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(getTotalAmount())}
            </Text>
            <Text style={styles.totalLabel}>Total Due</Text>
          </View>
        )}

        {/* Payment History Button */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('PaymentHistory', { student })}
          activeOpacity={0.8}
        >
          <Ionicons name="time-outline" size={20} color="#3B82F6" />
          <Text style={styles.historyButtonText}>View Payment History</Text>
          <Ionicons name="chevron-forward" size={20} color="#3B82F6" />
        </TouchableOpacity>

        {/* Fee Categories */}
        <View style={styles.categoriesSection}>

          {categories.length > 0 ? (
            categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
              >
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryIconContainer}>
                    <Ionicons 
                      name={getCategoryIcon(category.name)} 
                      size={24} 
                      color="#3B82F6" 
                    />
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>{category.name}</Text>
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
                  <View style={styles.categoryAmount}>
                    <Text style={styles.categoryAmountText}>
                      {formatCurrency(category.remaining_balance !== undefined ? category.remaining_balance : category.amount)}
                    </Text>
                    {category.remaining_balance !== undefined && category.remaining_balance < category.amount && (
                      <Text style={styles.originalAmountText}>
                        {formatCurrency(category.amount)}
                      </Text>
                    )}
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No Fee Data Available</Text>
              <Text style={styles.emptyStateText}>
                Fee information for this student has not been set up yet. Please check back later or contact your school.
              </Text>
            </View>
          )}
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
  summaryCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: 'white',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  categoryBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  mandatoryBadge: {
    backgroundColor: '#2C67A6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mandatoryText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  recurringBadge: {
    backgroundColor: '#2C67A6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recurringText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  oneTimeBadge: {
    backgroundColor: '#2C67A6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  oneTimeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  categoryAmount: {
    alignItems: 'flex-end',
  },
  categoryAmountText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  originalAmountText: {
    fontSize: 12,
    color: '#B0C4DE',
    textDecorationLine: 'line-through',
  },
  paymentPlansSection: {
    marginBottom: 24,
  },
  paymentPlanCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentPlanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  paymentPlanDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  paymentPlanAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  historyButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 12,
  },
});