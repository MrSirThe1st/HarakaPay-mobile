// Main navigation for parent app
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/parent/ProfileScreen';
import ConnectChildScreen from '../screens/ConnectChildScreen';
import LinkStudentScreen from '../screens/parent/LinkStudentScreen';
import ChildDetailsScreen from '../screens/parent/ChildDetailsScreen';
import FeeDetailsScreen from '../screens/parent/FeeDetailsScreen';
import PaymentPlansScreen from '../screens/parent/PaymentPlansScreen';
import PaymentPlanDetailsScreen from '../screens/parent/PaymentPlanDetailsScreen';
import PaymentsScreen from '../screens/parent/PaymentsScreen';
import PaymentScheduleScreen from '../screens/parent/PaymentScheduleScreen';
import PaymentStatusScreen from '../screens/parent/PaymentStatusScreen';
import PaymentHistoryScreen from '../screens/parent/PaymentHistoryScreen';
import colors from '../constants/colors';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { t } = useTranslation('navigation');

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          height: 80,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: t('screens.profile') }} />
      <Stack.Screen name="ConnectChild" component={ConnectChildScreen} options={{ title: t('screens.connectChild') }} />
      <Stack.Screen name="LinkStudent" component={LinkStudentScreen} options={{ title: t('screens.linkStudent') }} />
      <Stack.Screen name="ChildDetails" component={ChildDetailsScreen} options={{ title: t('screens.childDetails') }} />
      <Stack.Screen
        name="FeeDetails"
        component={FeeDetailsScreen}
        options={{
          title: t('screens.feeDetails'),
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen name="PaymentPlans" component={PaymentPlansScreen} options={{ title: t('screens.paymentPlans') }} />
      <Stack.Screen name="PaymentPlanDetails" component={PaymentPlanDetailsScreen} options={{ title: t('screens.paymentPlanDetails') }} />
      <Stack.Screen name="Payments" component={PaymentsScreen} options={{ title: t('screens.payments') }} />
      <Stack.Screen name="PaymentSchedule" component={PaymentScheduleScreen} options={{ title: t('screens.paymentSchedule') }} />
      <Stack.Screen name="PaymentStatus" component={PaymentStatusScreen} options={{ title: t('screens.paymentStatus') }} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} options={{ title: t('screens.paymentHistory') }} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
