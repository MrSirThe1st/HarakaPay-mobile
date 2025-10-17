// harakapay-mobile/src/screens/parent/StoreItemDetailsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addToCart } from '../../store/storeSlice';
import { StoreItem } from '../../types/store';
import { HireDurationPicker } from '../../components/store/HireDurationPicker';

interface StoreItemDetailsScreenProps {
  route: {
    params: {
      item: StoreItem;
    };
  };
  navigation: any;
}

const StoreItemDetailsScreen: React.FC<StoreItemDetailsScreenProps> = ({ route, navigation }) => {
  const { item } = route.params;
  const dispatch = useDispatch();
  
  const [quantity, setQuantity] = useState(1);
  const [hireStartDate, setHireStartDate] = useState('');
  const [hireEndDate, setHireEndDate] = useState('');
  const [showHirePicker, setShowHirePicker] = useState(false);

  useEffect(() => {
    // Set default hire dates if item is for hire
    if (item.itemType === 'hire' && item.hireSettings) {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + item.hireSettings.minDurationDays);
      
      setHireStartDate(today.toISOString().split('T')[0]);
      setHireEndDate(endDate.toISOString().split('T')[0]);
    }
  }, [item]);

  const handleAddToCart = () => {
    if (item.stockQuantity === 0) {
      Alert.alert('Out of Stock', 'This item is currently out of stock.');
      return;
    }
    
    if (quantity > item.stockQuantity) {
      Alert.alert('Insufficient Stock', `Only ${item.stockQuantity} items available.`);
      return;
    }

    if (item.itemType === 'hire') {
      if (!hireStartDate || !hireEndDate) {
        Alert.alert('Missing Dates', 'Please select hire start and end dates.');
        return;
      }
      
      const startDate = new Date(hireStartDate);
      const endDate = new Date(hireEndDate);
      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (durationDays < item.hireSettings?.minDurationDays) {
        Alert.alert('Invalid Duration', `Minimum hire duration is ${item.hireSettings.minDurationDays} days.`);
        return;
      }
      
      if (durationDays > item.hireSettings?.maxDurationDays) {
        Alert.alert('Invalid Duration', `Maximum hire duration is ${item.hireSettings.maxDurationDays} days.`);
        return;
      }
    }

    const cartItem = {
      item,
      quantity,
      hireStartDate: item.itemType === 'hire' ? hireStartDate : undefined,
      hireEndDate: item.itemType === 'hire' ? hireEndDate : undefined,
    };

    dispatch(addToCart(cartItem));
    Alert.alert('Success', 'Item added to cart', [
      { text: 'Continue Shopping', onPress: () => navigation.goBack() },
      { text: 'View Cart', onPress: () => navigation.navigate('StoreCart') },
    ]);
  };

  const handleRequestStock = () => {
    Alert.alert(
      'Request Stock',
      'Would you like to request this item to be restocked?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Request', 
          onPress: () => {
            // Navigate to stock request screen or show request form
            navigation.navigate('StockRequest', { item });
          }
        },
      ]
    );
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getStockStatus = () => {
    if (item.stockQuantity === 0) {
      return { text: 'Out of Stock', color: '#ff4444' };
    }
    if (item.stockQuantity <= item.lowStockThreshold) {
      return { text: 'Low Stock', color: '#ff8800' };
    }
    return { text: 'In Stock', color: '#00aa00' };
  };

  const stockStatus = getStockStatus();

  return (
    <ScrollView style={styles.container}>
      {/* Image Carousel */}
      <View style={styles.imageContainer}>
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image Available</Text>
          </View>
        )}
        
        {/* Stock Status Badge */}
        <View style={[styles.stockBadge, { backgroundColor: stockStatus.color }]}>
          <Text style={styles.stockBadgeText}>{stockStatus.text}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Item Info */}
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>
            {item.description || 'No description available'}
          </Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(item.price)}</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>
                {item.itemType === 'sale' ? 'For Sale' : 'For Hire'}
              </Text>
            </View>
          </View>

          <View style={styles.stockInfo}>
            <Text style={styles.stockText}>
              Stock: {item.stockQuantity} available
            </Text>
          </View>
        </View>

        {/* Hire Settings */}
        {item.itemType === 'hire' && item.hireSettings && (
          <View style={styles.hireSettings}>
            <Text style={styles.sectionTitle}>Hire Information</Text>
            <View style={styles.hireInfo}>
              <Text style={styles.hireText}>
                Duration: {item.hireSettings.minDurationDays} - {item.hireSettings.maxDurationDays} days
              </Text>
              {item.hireSettings.depositAmount && (
                <Text style={styles.hireText}>
                  Deposit: {formatPrice(item.hireSettings.depositAmount)}
                </Text>
              )}
              {item.hireSettings.lateFeePerDay && (
                <Text style={styles.hireText}>
                  Late Fee: {formatPrice(item.hireSettings.lateFeePerDay)}/day
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Quantity Selector */}
        <View style={styles.quantitySection}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{quantity}</Text>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.min(item.stockQuantity, quantity + 1))}
              disabled={quantity >= item.stockQuantity}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hire Date Picker */}
        {item.itemType === 'hire' && (
          <View style={styles.hireDatesSection}>
            <Text style={styles.sectionTitle}>Hire Dates</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowHirePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {hireStartDate && hireEndDate 
                  ? `${hireStartDate} to ${hireEndDate}`
                  : 'Select hire dates'
                }
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {item.stockQuantity > 0 ? (
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
            >
              <Text style={styles.addToCartButtonText}>
                Add to Cart - {formatPrice(item.price * quantity)}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.requestStockButton}
              onPress={handleRequestStock}
            >
              <Text style={styles.requestStockButtonText}>
                Request Stock
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Hire Duration Picker Modal */}
      {showHirePicker && item.itemType === 'hire' && item.hireSettings && (
        <HireDurationPicker
          visible={showHirePicker}
          onClose={() => setShowHirePicker(false)}
          hireSettings={item.hireSettings}
          onDatesSelected={(startDate, endDate) => {
            setHireStartDate(startDate);
            setHireEndDate(endDate);
            setShowHirePicker(false);
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  stockBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stockBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  itemInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  typeBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  stockInfo: {
    marginTop: 8,
  },
  stockText: {
    fontSize: 14,
    color: '#666',
  },
  hireSettings: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  hireInfo: {
    space: 8,
  },
  hireText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  quantitySection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  hireDatesSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  datePickerButton: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  actionButtons: {
    marginTop: 16,
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  requestStockButton: {
    backgroundColor: '#ff8800',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  requestStockButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StoreItemDetailsScreen;
