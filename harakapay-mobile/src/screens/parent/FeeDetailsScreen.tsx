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
import { useI18n } from '../../hooks/useI18n';
import { formatCurrency } from '../../utils/formatters';

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
  const { t, currentLanguage } = useI18n('payment');

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

  const translateCategoryName = (categoryName: string) => {
    // Normalize the category name to create a key
    const normalizedName = categoryName.toLowerCase().trim();

    // Try to find a translation key that matches
    const categoryKeys = [
      'tuition', 'transport', 'books', 'uniform', 'meals', 'food',
      'registration', 'activities', 'sports', 'library', 'laboratory',
      'technology', 'exam', 'excursion'
    ];

    for (const key of categoryKeys) {
      if (normalizedName.includes(key)) {
        return t(`fees.categories.${key}`);
      }
    }

    // If no translation found, return the original name
    return categoryName;
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

  if (error && !hasCachedData && !error.includes('No fee data found')) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>{t('fees.errorState.title')}</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
            <Text style={styles.retryButtonText}>{t('fees.errorState.retryButton')}</Text>
          </TouchableOpacity>
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
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
      >
         {/* Payment History Button */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('PaymentHistory', { student })}
          activeOpacity={0.8}
        >
          <Ionicons name="time-outline" size={24} color="#FFFFFF" />
          <Text style={styles.historyButtonText}>{t('fees.paymentHistory')}</Text>
          <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Summary Card - Only show when there are categories */}
        {categories.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{t('fees.feeSummary')}</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(getTotalAmount(), currentLanguage)}
            </Text>
          </View>
        )}

      

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
                    <Text style={styles.categoryName}>{translateCategoryName(category.name)}</Text>
                    <View style={styles.categoryBadges}>
                      {category.is_mandatory === true && (
                        <View style={styles.mandatoryBadge}>
                          <Text style={styles.mandatoryText}>{t('fees.badges.mandatory')}</Text>
                        </View>
                      )}
                      {category.supports_recurring === true && (
                        <View style={styles.recurringBadge}>
                          <Text style={styles.recurringText}>{t('fees.badges.recurring')}</Text>
                        </View>
                      )}
                      {category.supports_one_time === true && (
                        <View style={styles.oneTimeBadge}>
                          <Text style={styles.oneTimeText}>{t('fees.badges.oneTime')}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.categoryAmount}>
                    <Text style={styles.categoryAmountText}>
                      {formatCurrency(category.amount, currentLanguage)}
                    </Text>
                    {/* {category.remaining_balance !== undefined && category.remaining_balance < category.amount && (
                      <Text style={styles.remainingAmountText}>
                        Remaining: {formatCurrency(category.remaining_balance)}
                      </Text>
                    )} */}
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>{t('fees.emptyState.title')}</Text>
              <Text style={styles.emptyStateText}>
                {t('fees.emptyState.description')}
              </Text>
            </View>
          )}
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
  summaryCard: {
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,

  },
  summaryTitle: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
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
    backgroundColor: colors.primary,
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
  remainingAmountText: {
    fontSize: 12,
    color: '#B0C4DE',
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
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  historyButtonText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
});