import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { supabase } from '../../config/supabase';
import { colors } from '../../constants';
import { useI18n } from '../../hooks/useI18n';
import { formatCurrency } from '../../utils/formatters';

interface PaymentScreenProps {
  navigation: any;
  route: {
    params: {
      student: {
        id: string;
        first_name: string;
        last_name: string;
        student_id: string;
        school_name: string;
      };
      feeAssignment?: any;
      paymentPlan?: any;
      selectedInstallment?: any;
    };
  };
}

export default function PaymentScreen({ route, navigation }: PaymentScreenProps) {
  const { student, paymentPlan, selectedInstallment } = route.params;
  const { t, currentLanguage } = useI18n('payment');

  // State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feeDetails, setFeeDetails] = useState<any>(null);
  const [currentInstallment, setCurrentInstallment] = useState<any>(null);
  const [parent, setParent] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [paymentType, setPaymentType] = useState<'one_time' | 'monthly' | 'installment'>('one_time');

  useEffect(() => {
    loadFeeDetails();
    loadParentInfo();
  }, []);

  // Pre-fill amount and installment info when selectedInstallment is passed
  useEffect(() => {
    if (selectedInstallment) {
      console.log('Selected installment:', selectedInstallment);
      setAmount(selectedInstallment.amount?.toString() || '');
      setCurrentInstallment(selectedInstallment);
      setPaymentType('installment');
      // Set selected month based on installment number if available
      if (selectedInstallment.installment_number) {
        setSelectedMonth(selectedInstallment.installment_number);
      }
    }
  }, [selectedInstallment]);

  const loadParentInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: parentData } = await supabase
        .from('parents')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (parentData) {
        setParent(parentData);
        // Pre-fill phone number if available
        if (parentData.phone) {
          setPhoneNumber(parentData.phone);
        }
      }
    } catch (error) {
      console.error('Error loading parent info:', error);
    }
  };

  const loadFeeDetails = async () => {
    try {
      setIsLoading(true);

      // If paymentPlan is passed directly, use it
      if (paymentPlan) {
        console.log('Using payment plan from route params:', paymentPlan);
        
        // Create a mock fee assignment with the payment plan
        const mockAssignment = {
          id: 'mock-assignment',
          student_id: student.id,
          payment_plan_id: paymentPlan.id,
          total_due: paymentPlan.total_amount || 0,
          paid_amount: 0,
          status: 'active',
          payment_plans: paymentPlan
        };
        
        setFeeDetails(mockAssignment);
        
        // Set payment type based on plan
        const planType = paymentPlan.type;
        if (planType === 'one_time') {
          setPaymentType('one_time');
          setAmount(paymentPlan.total_amount?.toString() || '0');
        } else if (planType === 'monthly') {
          setPaymentType('monthly');
        } else {
          setPaymentType('installment');
          if (paymentPlan.installments && paymentPlan.installments.length > 0) {
            const currentInstallment = paymentPlan.installments[0];
            setCurrentInstallment(currentInstallment);
            setAmount(currentInstallment.amount?.toString() || '0');
          }
        }
        
        setIsLoading(false);
        return;
      }

      // Get current academic year
      const { data: academicYear } = await supabase
        .from('academic_years')
        .select('*')
        .eq('is_active', true)
        .single();

      if (!academicYear) {
        Alert.alert(t('errors.title'), t('errors.noAcademicYear'));
        return;
      }

      // Get student fee assignment with payment plan
      const { data: assignment } = await supabase
        .from('student_fee_assignments')
        .select(`
          *,
          payment_plans (
            id,
            type,
            discount_percentage,
            installments
          )
        `)
        .eq('student_id', student.id)
        .eq('academic_year_id', academicYear.id)
        .in('status', ['active', 'fully_paid']) // Include active and fully paid (exclude cancelled)
        .single();

      if (assignment) {
        setFeeDetails(assignment);
        
        // Determine payment type based on plan type
        const planType = assignment.payment_plans?.type;
        if (planType === 'one_time') {
          setPaymentType('one_time');
          setAmount(assignment.total_due.toString());
        } else if (planType === 'monthly') {
          setPaymentType('monthly');
          // Don't set amount yet, user needs to select month
        } else {
          setPaymentType('installment');
          // Parse installments and find current due installment
          if (assignment.payment_plans?.installments) {
            const installments = assignment.payment_plans.installments;
            const now = new Date();
            
            // Find the first unpaid or current installment
            const current = installments.find((inst: any) => {
              const dueDate = new Date(inst.due_date);
              return dueDate >= now && !inst.paid;
            }) || installments[0]; // Fallback to first installment
            
            setCurrentInstallment(current);
            setAmount(current.amount.toString());
          }
        }
      } else {
        Alert.alert(t('notices.title'), t('notices.noPlan'));
      }
    } catch (error) {
      console.error('Error loading fee details:', error);
      Alert.alert(t('errors.title'), t('errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format as: 243XXXXXXXXX (for DRC)
    if (cleaned.startsWith('0')) {
      return '243' + cleaned.substring(1);
    } else if (cleaned.startsWith('243')) {
      return cleaned;
    } else {
      return '243' + cleaned;
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const formatted = formatPhoneNumber(phone);
    // DRC numbers: 243XXXXXXXXX (12-14 digits total)
    return /^243\d{9,11}$/.test(formatted);
  };

  const handlePayment = async () => {
    // Validation
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      Alert.alert(
        t('errors.invalidPhone'),
        t('errors.invalidPhoneMessage')
      );
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert(t('errors.invalidAmount'), t('errors.invalidAmountMessage'));
      return;
    }

    if (paymentType === 'monthly' && selectedMonth === null) {
      Alert.alert(t('errors.selectMonth'), t('errors.selectMonthMessage'));
      return;
    }

    if (!parent || !feeDetails) {
      Alert.alert(t('errors.title'), t('errors.missingInfo'));
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    const paymentAmount = parseFloat(amount);

    Alert.alert(
      t('confirmPayment.title'),
      t('confirmPayment.message', {
        amount: paymentAmount.toFixed(2),
        studentName: `${student.first_name} ${student.last_name}`,
        phone: formattedPhone
      }),
      [
        { text: t('confirmPayment.cancel'), style: 'cancel' },
        { text: t('confirmPayment.confirm'), onPress: () => initiatePayment(formattedPhone, paymentAmount) }
      ]
    );
  };

  const initiatePayment = async (formattedPhone: string, paymentAmount: number) => {
    setIsLoading(true);

    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Alert.alert(t('errors.title'), t('errors.loginRequired'));
        navigation.navigate('Login');
        return;
      }

      // Call your Next.js API endpoint
      console.log('💳 Making API call to:', `${process.env.EXPO_PUBLIC_API_URL}/api/payments/initiate`);
      console.log('💳 Request payload:', {
        studentId: student.id,
        amount: paymentAmount,
        phoneNumber: formattedPhone,
        paymentPlanId: feeDetails.payment_plan_id || paymentPlan?.id,
        installmentNumber: currentInstallment?.installment_number || 1,
        paymentType: paymentType,
        selectedMonth: selectedMonth,
      });
      
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/payments/initiate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            studentId: student.id,
            amount: paymentAmount,
            phoneNumber: formattedPhone,
            paymentPlanId: feeDetails.payment_plan_id || paymentPlan?.id,
            installmentNumber: currentInstallment?.installment_number || 1,
            paymentType: paymentType,
            selectedMonth: selectedMonth,
          }),
        }
      );

      console.log('💳 Response status:', response.status);
      console.log('💳 Response headers:', response.headers);
      
      const responseText = await response.text();
      console.log('💳 Raw response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('💳 JSON Parse Error:', parseError);
        console.error('💳 Response was:', responseText);
        throw new Error(`Server returned invalid response: ${responseText.substring(0, 200)}...`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Payment initiation failed');
      }

      if (data.success) {
        Alert.alert(
          t('success.paymentInitiated'),
          t('success.paymentInitiatedMessage', {
            phone: formattedPhone,
            transactionId: data.transactionId
          }),
          [
            {
              text: t('success.checkStatus'),
              onPress: () => navigation.navigate('PaymentStatus', {
                paymentId: data.paymentId,
                transactionId: data.transactionId,
                studentName: `${student.first_name} ${student.last_name}`,
                amount: paymentAmount,
              })
            }
          ]
        );
      } else {
        Alert.alert(t('errors.paymentFailed'), data.message || t('errors.paymentFailed'));
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      Alert.alert(
        t('errors.paymentError'),
        error.message || t('errors.paymentFailed')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const calculateBalance = () => {
    if (!feeDetails) return 0;
    return parseFloat(feeDetails.total_due) - parseFloat(feeDetails.paid_amount);
  };

  const getMonthlyAmount = () => {
    if (!feeDetails) return 0;
    const totalDue = parseFloat(feeDetails.total_due);
    // Divide by 10 months (academic year)
    return (totalDue / 10).toFixed(2);
  };

  const selectMonth = (month: number) => {
    setSelectedMonth(month);
    setAmount(getMonthlyAmount().toString());
    setShowMonthPicker(false);
  };

  const getMonthName = (monthIndex: number) => {
    const monthKeys = [
      'september', 'october', 'november', 'december', 'january',
      'february', 'march', 'april', 'may', 'june'
    ];
    return t(`makePaymentScreen.months.${monthKeys[monthIndex]}`);
  };

  const renderMonthPicker = () => {
    const months = Array.from({ length: 10 }, (_, i) => i + 1); // Sept-June (10 months)

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showMonthPicker}
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.monthPicker}>
            <Text style={styles.modalTitle}>{t('makePaymentScreen.selectMonthModalTitle')}</Text>
            <ScrollView style={styles.monthList}>
              {months.map((month, index) => (
                <TouchableOpacity
                  key={month}
                  style={styles.monthItem}
                  onPress={() => selectMonth(month)}
                >
                  <Text style={styles.monthText}>{getMonthName(index)}</Text>
                  <Text style={styles.monthAmount}>{formatCurrency(parseFloat(getMonthlyAmount()), currentLanguage)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowMonthPicker(false)}
            >
              <Text style={styles.modalCloseText}>{t('makePaymentScreen.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  if (isLoading && !feeDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} style={{ transform: [{ scale: 2 }] }} />

        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

       
        {/* Student Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('makePaymentScreen.paymentFor')}</Text>
          <Text style={styles.studentName}>
            {student.first_name} {student.last_name}
          </Text>

          <Text style={styles.studentDetails}>
            {student.school_name}
          </Text>
        </View>

        

        {/* Payment Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('makePaymentScreen.paymentDetails')}</Text>


          {/* Month Selection for Monthly Payments */}
          {paymentType === 'monthly' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('makePaymentScreen.selectMonth')}</Text>
              <TouchableOpacity
                style={[styles.input, styles.monthSelector]}
                onPress={() => setShowMonthPicker(true)}
              >
                <Text style={[styles.monthSelectorText, !selectedMonth && styles.placeholderText]}>
                  {selectedMonth ?
                    t('makePaymentScreen.monthSelector', { number: selectedMonth, amount: getMonthlyAmount() }) :
                    t('makePaymentScreen.tapToSelectMonth')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('makePaymentScreen.phoneNumber')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('makePaymentScreen.phonePlaceholder')}
              placeholderTextColor="#9CA3AF"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={14}
            />
            <Text style={styles.inputHint}>
              {t('makePaymentScreen.phoneHint')}
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('makePaymentScreen.amountLabel')}</Text>
            <TextInput
              style={[styles.input, paymentType === 'one_time' && styles.inputReadonly]}
              placeholder={t('makePaymentScreen.amountPlaceholder')}
              placeholderTextColor="#9CA3AF"
              value={amount}
              onChangeText={paymentType === 'one_time' ? undefined : setAmount}
              keyboardType="decimal-pad"
              editable={paymentType !== 'one_time'}
            />
          </View>
        </View>

        {renderMonthPicker()}

        {/* Payment Method Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{t('makePaymentScreen.paymentMethod.title')}</Text>
          <Text style={styles.infoText}>
            {t('makePaymentScreen.paymentMethod.instructions')}
          </Text>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={[styles.payButton, isLoading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>
              {t('makePaymentScreen.payButton', { amount: parseFloat(amount || '0').toFixed(2) })}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text.secondary,
  },
  header: {
    padding: 20,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  studentName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  studentDetails: {
    fontSize: 15,
    color: colors.text.secondary,
    marginTop: 4,
    lineHeight: 22,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  summaryLabelBold: {
    fontSize: 17,
    color: colors.text.primary,
    fontWeight: '700',
  },
  summaryValue: {
    fontSize: 17,
    color: colors.text.primary,
    fontWeight: '600',
  },
  paidAmount: {
    color: colors.success,
    fontSize: 17,
    fontWeight: '700',
  },
  balanceAmount: {
    fontSize: 28,
    color: colors.error,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
  installmentInfo: {
    marginTop: 16,
    padding: 18,
    backgroundColor: colors.blue.pale,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  installmentLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  installmentAmount: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 6,
  },
  installmentDue: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    padding: 18,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: '#FFFFFF',
  },
  inputHint: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 8,
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: colors.blue.pale,
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  payButton: {
    backgroundColor: colors.primary,
    margin: 16,
    marginTop: 8,
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  payButtonDisabled: {
    backgroundColor: colors.text.disabled,
    shadowOpacity: 0,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomPadding: {
    height: 32,
  },
  paymentTypeInfo: {
    backgroundColor: colors.blue.pale,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentTypeLabel: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '600',
  },
  monthSelector: {
    justifyContent: 'center',
  },
  monthSelectorText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  placeholderText: {
    color: colors.text.secondary,
  },
  inputReadonly: {
    backgroundColor: '#F9FAFB',
    color: colors.text.secondary,
    borderColor: '#000000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  monthPicker: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  monthList: {
    maxHeight: 300,
  },
  monthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  monthText: {
    fontSize: 17,
    color: colors.text.primary,
    fontWeight: '600',
  },
  monthAmount: {
    fontSize: 17,
    color: colors.primary,
    fontWeight: '700',
  },
  modalCloseButton: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalCloseText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '600',
  },
});