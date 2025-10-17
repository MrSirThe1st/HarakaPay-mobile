// harakapay-mobile/src/components/store/ItemCard.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { StoreItem } from '../../types/store';

interface ItemCardProps {
  item: StoreItem;
  onPress: () => void;
  onAddToCart: (quantity: number) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onPress, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (item.stockQuantity === 0) {
      Alert.alert('Out of Stock', 'This item is currently out of stock.');
      return;
    }
    
    if (quantity > item.stockQuantity) {
      Alert.alert('Insufficient Stock', `Only ${item.stockQuantity} items available.`);
      return;
    }
    
    onAddToCart(quantity);
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
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Image */}
      <View style={styles.imageContainer}>
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        
        {/* Stock Status Badge */}
        <View style={[styles.stockBadge, { backgroundColor: stockStatus.color }]}>
          <Text style={styles.stockBadgeText}>{stockStatus.text}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
          <Text style={styles.type}>
            {item.itemType === 'sale' ? 'For Sale' : 'For Hire'}
          </Text>
        </View>

        {/* Quantity Selector and Add to Cart */}
        <View style={styles.actionContainer}>
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

          <TouchableOpacity
            style={[
              styles.addToCartButton,
              item.stockQuantity === 0 && styles.addToCartButtonDisabled,
            ]}
            onPress={handleAddToCart}
            disabled={item.stockQuantity === 0}
          >
            <Text
              style={[
                styles.addToCartButtonText,
                item.stockQuantity === 0 && styles.addToCartButtonTextDisabled,
              ]}
            >
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 120,
    backgroundColor: '#f0f0f0',
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
    fontSize: 14,
  },
  stockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
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
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
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
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  addToCartButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  addToCartButtonTextDisabled: {
    color: '#999',
  },
});
