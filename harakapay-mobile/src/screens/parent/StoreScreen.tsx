// harakapay-mobile/src/screens/parent/StoreScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  fetchCategories,
  fetchItems,
  setItemFilters,
  clearItemFilters,
  addToCart,
} from '../../store/storeSlice';
import { StoreCategory, StoreItem, CartItem } from '../../types/store';
import { ItemCard } from '../../components/store/ItemCard';

const StoreScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { categories, items, cart, loading, errors } = useSelector((state: RootState) => state.store);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'sale' | 'hire' | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(fetchCategories()),
        dispatch(fetchItems({ filters: {} })),
      ]);
    } catch (error) {
      console.error('Error loading store data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    dispatch(setItemFilters({ search: query || undefined }));
    dispatch(fetchItems({ filters: { search: query || undefined } }));
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    dispatch(setItemFilters({ categoryId: categoryId || undefined }));
    dispatch(fetchItems({ filters: { categoryId: categoryId || undefined } }));
  };

  const handleTypeFilter = (type: 'sale' | 'hire' | null) => {
    setSelectedType(type);
    dispatch(setItemFilters({ itemType: type || undefined }));
    dispatch(fetchItems({ filters: { itemType: type || undefined } }));
  };

  const handleAddToCart = (item: StoreItem, quantity: number = 1) => {
    const cartItem: CartItem = {
      item,
      quantity,
    };
    dispatch(addToCart(cartItem));
    Alert.alert('Success', 'Item added to cart');
  };

  const handleItemPress = (item: StoreItem) => {
    navigation?.navigate('StoreItemDetails', { item });
  };

  const renderCategoryChip = ({ item }: { item: StoreCategory }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.selectedCategoryChip,
      ]}
      onPress={() => handleCategoryFilter(selectedCategory === item.id ? null : item.id)}
    >
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory === item.id && styles.selectedCategoryChipText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: StoreItem }) => (
    <ItemCard
      item={item}
      onPress={() => handleItemPress(item)}
      onAddToCart={(quantity) => handleAddToCart(item, quantity)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No items found</Text>
      <Text style={styles.emptyStateSubtext}>
        Try adjusting your search or filters
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>School Store</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation?.navigate('StoreCart')}
        >
          <Text style={styles.cartButtonText}>Cart ({cart.totalItems})</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Type Filters */}
      <View style={styles.typeFilters}>
        <TouchableOpacity
          style={[
            styles.typeFilterButton,
            selectedType === null && styles.selectedTypeFilterButton,
          ]}
          onPress={() => handleTypeFilter(null)}
        >
          <Text
            style={[
              styles.typeFilterText,
              selectedType === null && styles.selectedTypeFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeFilterButton,
            selectedType === 'sale' && styles.selectedTypeFilterButton,
          ]}
          onPress={() => handleTypeFilter(selectedType === 'sale' ? null : 'sale')}
        >
          <Text
            style={[
              styles.typeFilterText,
              selectedType === 'sale' && styles.selectedTypeFilterText,
            ]}
          >
            For Sale
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeFilterButton,
            selectedType === 'hire' && styles.selectedTypeFilterButton,
          ]}
          onPress={() => handleTypeFilter(selectedType === 'hire' ? null : 'hire')}
        >
          <Text
            style={[
              styles.typeFilterText,
              selectedType === 'hire' && styles.selectedTypeFilterText,
            ]}
          >
            For Hire
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Items Grid */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.itemsGrid}
        columnWrapperStyle={styles.itemsRow}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Error Display */}
      {errors.items && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errors.items}</Text>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cartButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  typeFilters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  typeFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  selectedTypeFilterButton: {
    backgroundColor: '#007AFF',
  },
  typeFilterText: {
    fontSize: 14,
    color: '#666',
  },
  selectedTypeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  selectedCategoryChip: {
    backgroundColor: '#007AFF',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryChipText: {
    color: '#fff',
    fontWeight: '600',
  },
  itemsGrid: {
    padding: 16,
  },
  itemsRow: {
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default StoreScreen;
