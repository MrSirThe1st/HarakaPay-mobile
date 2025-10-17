// harakapay-mobile/src/screens/parent/StoreCartScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { removeFromCart, updateCartItemQuantity, clearCart } from '../../store/storeSlice';
import { CartItem } from '../../types/store';
import { CartItemComponent } from '../../components/store/CartItemComponent';

interface StoreCartScreenProps {
  navigation: any;
}

const StoreCartScreen: React.FC<StoreCartScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state: RootState) => state.store);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => dispatch(removeFromCart(itemId)) },
      ]
    );
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      dispatch(updateCartItemQuantity({ itemId, quantity }));
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add some items first.');
      return;
    }

    if (!selectedStudent) {
      Alert.alert('Select Student', 'Please select a student for this order.');
      return;
    }

    navigation.navigate('StoreCheckout', {
      cartItems: cart.items,
      totalAmount: cart.totalAmount,
      selectedStudent,
    });
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => dispatch(clearCart()) },
      ]
    );
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <CartItemComponent
      cartItem={item}
      onUpdateQuantity={(quantity) => handleUpdateQuantity(item.item.id, quantity)}
      onRemove={() => handleRemoveItem(item.item.id)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Your cart is empty</Text>
      <Text style={styles.emptyStateText}>
        Browse our store and add items to your cart
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('Store')}
      >
        <Text style={styles.browseButtonText}>Browse Store</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Shopping Cart</Text>
        {cart.items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {cart.items.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          {/* Cart Items */}
          <FlatList
            data={cart.items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.item.id}
            style={styles.cartList}
            contentContainerStyle={styles.cartListContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Student Selection */}
          <View style={styles.studentSelection}>
            <Text style={styles.studentSelectionTitle}>Select Student</Text>
            <TouchableOpacity
              style={styles.studentButton}
              onPress={() => {
                // Navigate to student selection screen
                navigation.navigate('StudentSelection', {
                  onStudentSelected: setSelectedStudent,
                });
              }}
            >
              <Text style={styles.studentButtonText}>
                {selectedStudent ? 'Change Student' : 'Select Student'}
              </Text>
            </TouchableOpacity>
            {selectedStudent && (
              <Text style={styles.selectedStudentText}>
                Selected: {selectedStudent}
              </Text>
            )}
          </View>

          {/* Order Summary */}
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items ({cart.totalItems})</Text>
              <Text style={styles.summaryValue}>{formatPrice(cart.totalAmount)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryTotal}>{formatPrice(cart.totalAmount)}</Text>
            </View>
          </View>

          {/* Checkout Button */}
          <View style={styles.checkoutContainer}>
            <TouchableOpacity
              style={[
                styles.checkoutButton,
                (!selectedStudent || loading) && styles.checkoutButtonDisabled,
              ]}
              onPress={handleCheckout}
              disabled={!selectedStudent || loading}
            >
              <Text style={styles.checkoutButtonText}>
                {loading ? 'Processing...' : `Checkout - ${formatPrice(cart.totalAmount)}`}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  clearButton: {
    paddingVertical: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#ff4444',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cartList: {
    flex: 1,
  },
  cartListContent: {
    padding: 16,
  },
  studentSelection: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  studentSelectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  studentButton: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  studentButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedStudentText: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 8,
    textAlign: 'center',
  },
  orderSummary: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#ccc',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StoreCartScreen;
