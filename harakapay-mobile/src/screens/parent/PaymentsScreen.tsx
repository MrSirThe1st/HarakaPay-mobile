import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { fetchStudentFeeCategories, FeeCategoryItem } from '../../api/paymentApi';

type PaymentsRouteParams = {
  studentId?: string;
};

const PaymentsScreen: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, PaymentsRouteParams>, string>>();
  const navigation = useNavigation<any>();
  const studentId = route.params?.studentId;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<FeeCategoryItem[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!studentId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStudentFeeCategories(studentId);
        if (mounted) setCategories(data);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load fee categories');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [studentId]);

  const renderItem = ({ item }: { item: FeeCategoryItem }) => (
    <TouchableOpacity
      style={styles.categoryRow}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PaymentSchedule', { studentId, categoryId: item.id })}
    >
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        {!!item.description && (
          <Text style={styles.categoryDesc} numberOfLines={2}>{item.description}</Text>
        )}
        <View style={styles.pillsRow}>
          {item.is_mandatory && <Text style={[styles.pill, styles.pillMandatory]}>Mandatory</Text>}
          {item.supports_recurring && <Text style={[styles.pill, styles.pillRecurring]}>Recurring</Text>}
          {item.supports_one_time && <Text style={[styles.pill, styles.pillOneTime]}>One-time</Text>}
        </View>
      </View>
      <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Payments</Text>
        {studentId && (
          <Text style={styles.subTitle}>Selected student: {studentId}</Text>
        )}

        {loading && (
          <View style={styles.centered}> 
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Loading fee categories…</Text>
          </View>
        )}

        {!!error && !loading && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !error && (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={categories.length === 0 ? styles.emptyContent : undefined}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text style={styles.emptyText}>No fee categories found for this student.</Text>
              </View>
            }
          />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    marginTop: 8,
    color: '#6B7280',
  },
  errorText: {
    color: '#EF4444',
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyText: {
    color: '#6B7280',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryInfo: {
    flex: 1,
    paddingRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  categoryDesc: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  pillsRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 6,
  },
  pill: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    fontSize: 11,
    overflow: 'hidden',
  },
  pillMandatory: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  pillRecurring: {
    backgroundColor: '#DBEAFE',
    color: '#1E3A8A',
  },
  pillOneTime: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
});

export default PaymentsScreen;
