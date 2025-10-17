// harakapay-mobile/src/screens/parent/StoreCheckoutScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { createOrder, clearCart } from '../../store/storeSlice';
import { CartItem } from '../../types/store';

interface StoreCheckoutScreenProps {
  route: {
    params: {
      cartItems: CartItem[];
      totalAmount: number;
      selectedStudent: string;
    };
  };
  navigation: any;
}

const StoreCheckoutScreen: React.FC<StoreCheckoutScreenProps> = ({ route, navigation }) => {
  const { cartItems, totalAmount, selectedStudent } = route.params;
  const dispatch = useDispatch();
  const { loading, errors } = useSelector((state: RootState) => state.store);
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');

  const handlePlaceOrder = async () => {
    try {
      // Prepare order data
      const orderData = {
        studentId: selectedStudent,
        orderType: cartItems.some(item => item.item.itemType === 'hire') ? 'hire' : 'purchase',
        items: cartItems.map(item => ({
          itemId: item.item.id,
          quantity: item.quantity,
          hireStartDate: item.hireStartDate,
          hireEndDate: item.hireEndDate,
        })),
        notes: notes.trim() || undefined,
      };

      // Create order
      const result = await dispatch(createOrder(orderData));
      
      if (result.type.endsWith('/fulfilled')) {
        Alert.alert(
          'Order Placed Successfully',
          'Your order has been placed and is being processed.',
          [
            {
              text: 'OK',
              onPress: () => {
                dispatch(clearCart());
                navigation.navigate('StoreOrders');
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const renderCartItem = (item: CartItem, index: number) => (
    <View key={index} style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.item.name}</Text>
        <Text style={styles.itemDetails}>
          {item.quantity} × {formatPrice(item.item.price)}
        </Text>
        {item.hireStartDate && item.hireEndDate && (
          <Text style={styles.hireDates}>
            Hire: {new Date(item.hireStartDate).toLocaleDateString()} - {new Date(item.hireEndDate).toLocaleDateString()}
          </Text>
        )}
      </View>
      <Text style={styles.itemSubtotal}>
        {formatPrice(item.item.price * item.quantity)}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.orderInfo}>
          <Text style={styles.orderInfoText}>Student: {selectedStudent}</Text>
          <Text style={styles.orderInfoText}>
            Order Type: {cartItems.some(item => item.item.itemType === 'hire') ? 'Hire' : 'Purchase'}
          </Text>
        </View>
      </View>

      {/* Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items ({cartItems.length})</Text>
        {cartItems.map(renderCartItem)}
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentMethods}>
          <TouchableOpacity
            style={[
              styles.paymentMethod,
              paymentMethod === 'cash' && styles.selectedPaymentMethod,
            ]}
            onPress={() => setPaymentMethod('cash')}
          >
            <Text style={[
              styles.paymentMethodText,
              paymentMethod === 'cash' && styles.selectedPaymentMethodText,
            ]}>
              Cash
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentMethod,
              paymentMethod === 'bank_transfer' && styles.selectedPaymentMethod,
            ]}
            onPress={() => setPaymentMethod('bank_transfer')}
          >
            <Text style={[
              styles.paymentMethodText,
              paymentMethod === 'bank_transfer' && styles.selectedPaymentMethodText,
            ]}>
              Bank Transfer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentMethod,
              paymentMethod === 'mobile_money' && styles.selectedPaymentMethod,
            ]}
            onPress={() => setPaymentMethod('mobile_money')}
          >
            <Text style={[
              styles.paymentMethodText,
              paymentMethod === 'mobile_money' && styles.selectedPaymentMethodText,
            ]}>
              Mobile Money
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Notes (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any special instructions or notes..."
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Total */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>{formatPrice(totalAmount)}</Text>
        </View>
      </View>

      {/* Place Order Button */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            loading && styles.placeOrderButtonDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.placeOrderButtonText}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Error Display */}
      {errors.creatingOrder && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errors.creatingOrder}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  orderInfo: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  orderInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  hireDates: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  itemSubtotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  paymentMethod: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 100,
    alignItems: 'center',
  },
  selectedPaymentMethod: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  paymentMethodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedPaymentMethodText: {
    color: '#fff',
  },
  notesInput: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    color: '#333',
  },
  totalSection: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  checkoutContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
  },
  placeOrderButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#ccc',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ff4444',
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default StoreCheckoutScreen;
