// harakapay-mobile/src/components/store/CartItemComponent.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { CartItem } from '../../types/store';

interface CartItemComponentProps {
  cartItem: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItemComponent: React.FC<CartItemComponentProps> = ({
  cartItem,
  onUpdateQuantity,
  onRemove,
}) => {
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      {/* Image */}
      <View style={styles.imageContainer}>
        {cartItem.item.images && cartItem.item.images.length > 0 ? (
          <Image source={{ uri: cartItem.item.images[0] }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.itemName} numberOfLines={2}>
          {cartItem.item.name}
        </Text>
        
        <Text style={styles.itemDescription} numberOfLines={2}>
          {cartItem.item.description || 'No description'}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(cartItem.item.price)}</Text>
          <Text style={styles.type}>
            {cartItem.item.itemType === 'sale' ? 'For Sale' : 'For Hire'}
          </Text>
        </View>

        {/* Hire Dates */}
        {cartItem.item.itemType === 'hire' && cartItem.hireStartDate && cartItem.hireEndDate && (
          <View style={styles.hireDates}>
            <Text style={styles.hireDatesLabel}>Hire Period:</Text>
            <Text style={styles.hireDatesText}>
              {formatDate(cartItem.hireStartDate)} - {formatDate(cartItem.hireEndDate)}
            </Text>
          </View>
        )}

        {/* Quantity Controls */}
        <View style={styles.quantityContainer}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(cartItem.quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{cartItem.quantity}</Text>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(cartItem.quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={onRemove}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>

        {/* Subtotal */}
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalLabel}>Subtotal:</Text>
          <Text style={styles.subtotalAmount}>
            {formatPrice(cartItem.item.price * cartItem.quantity)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
  },
  content: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  type: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  hireDates: {
    marginBottom: 8,
  },
  hireDatesLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  hireDatesText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  removeButtonText: {
    fontSize: 14,
    color: '#ff4444',
    fontWeight: '500',
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  subtotalLabel: {
    fontSize: 14,
    color: '#666',
  },
  subtotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
