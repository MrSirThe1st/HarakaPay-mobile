// harakapay-mobile/src/store/storeSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  StoreCategory, 
  StoreItem, 
  StoreOrder, 
  HireRecord, 
  StockRequest,
  CartItem,
  Cart,
  StoreItemFilters,
  CreateOrderData,
  StockRequestFormData
} from '../types/store';
import { storeApi } from '../api/storeApi';

// Async thunks
export const fetchCategories = createAsyncThunk(
  'store/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storeApi.categories.getAll();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to fetch categories');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchItems = createAsyncThunk(
  'store/fetchItems',
  async ({ page = 1, limit = 50, filters }: { page?: number; limit?: number; filters?: StoreItemFilters } = {}, { rejectWithValue }) => {
    try {
      const response = await storeApi.items.getAll(page, limit, filters);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to fetch items');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchItemById = createAsyncThunk(
  'store/fetchItemById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await storeApi.items.getById(id);
      if (response.success && response.data) {
        return response.data.item;
      }
      return rejectWithValue(response.error || 'Failed to fetch item');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'store/fetchOrders',
  async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
    try {
      const response = await storeApi.orders.getAll(page, limit);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to fetch orders');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const createOrder = createAsyncThunk(
  'store/createOrder',
  async (orderData: CreateOrderData, { rejectWithValue }) => {
    try {
      const response = await storeApi.orders.create(orderData);
      if (response.success && response.data) {
        return response.data.order;
      }
      return rejectWithValue(response.error || 'Failed to create order');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchStockRequests = createAsyncThunk(
  'store/fetchStockRequests',
  async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
    try {
      const response = await storeApi.stockRequests.getAll(page, limit);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to fetch stock requests');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const createStockRequest = createAsyncThunk(
  'store/createStockRequest',
  async (requestData: StockRequestFormData, { rejectWithValue }) => {
    try {
      const response = await storeApi.stockRequests.create(requestData);
      if (response.success && response.data) {
        return response.data.request;
      }
      return rejectWithValue(response.error || 'Failed to create stock request');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchHireRecords = createAsyncThunk(
  'store/fetchHireRecords',
  async ({ page = 1, limit = 50, status }: { page?: number; limit?: number; status?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await storeApi.hireRecords.getAll(page, limit, status);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to fetch hire records');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Initial state
interface StoreState {
  // Data
  categories: StoreCategory[];
  items: StoreItem[];
  orders: StoreOrder[];
  stockRequests: StockRequest[];
  hireRecords: HireRecord[];
  
  // Cart
  cart: Cart;
  
  // Loading states
  loading: {
    categories: boolean;
    items: boolean;
    orders: boolean;
    stockRequests: boolean;
    hireRecords: boolean;
    creatingOrder: boolean;
    creatingStockRequest: boolean;
  };
  
  // Error states
  errors: {
    categories: string | null;
    items: string | null;
    orders: string | null;
    stockRequests: string | null;
    hireRecords: string | null;
    creatingOrder: string | null;
    creatingStockRequest: string | null;
  };
  
  // Filters
  itemFilters: StoreItemFilters;
}

const initialState: StoreState = {
  categories: [],
  items: [],
  orders: [],
  stockRequests: [],
  hireRecords: [],
  cart: {
    items: [],
    totalAmount: 0,
    totalItems: 0,
  },
  loading: {
    categories: false,
    items: false,
    orders: false,
    stockRequests: false,
    hireRecords: false,
    creatingOrder: false,
    creatingStockRequest: false,
  },
  errors: {
    categories: null,
    items: null,
    orders: null,
    stockRequests: null,
    hireRecords: null,
    creatingOrder: null,
    creatingStockRequest: null,
  },
  itemFilters: {},
};

// Helper function to calculate cart totals
const calculateCartTotals = (items: CartItem[]): { totalAmount: number; totalItems: number } => {
  const totalAmount = items.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { totalAmount, totalItems };
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    // Cart actions
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.cart.items.findIndex(
        item => item.item.id === action.payload.item.id
      );
      
      if (existingItemIndex >= 0) {
        state.cart.items[existingItemIndex].quantity += action.payload.quantity;
      } else {
        state.cart.items.push(action.payload);
      }
      
      const totals = calculateCartTotals(state.cart.items);
      state.cart.totalAmount = totals.totalAmount;
      state.cart.totalItems = totals.totalItems;
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart.items = state.cart.items.filter(item => item.item.id !== action.payload);
      
      const totals = calculateCartTotals(state.cart.items);
      state.cart.totalAmount = totals.totalAmount;
      state.cart.totalItems = totals.totalItems;
    },
    
    updateCartItemQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const item = state.cart.items.find(item => item.item.id === action.payload.itemId);
      if (item) {
        item.quantity = action.payload.quantity;
        
        const totals = calculateCartTotals(state.cart.items);
        state.cart.totalAmount = totals.totalAmount;
        state.cart.totalItems = totals.totalItems;
      }
    },
    
    clearCart: (state) => {
      state.cart = {
        items: [],
        totalAmount: 0,
        totalItems: 0,
      };
    },
    
    // Filter actions
    setItemFilters: (state, action: PayloadAction<StoreItemFilters>) => {
      state.itemFilters = action.payload;
    },
    
    clearItemFilters: (state) => {
      state.itemFilters = {};
    },
    
    // Clear errors
    clearError: (state, action: PayloadAction<keyof StoreState['errors']>) => {
      state.errors[action.payload] = null;
    },
    
    clearAllErrors: (state) => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key as keyof StoreState['errors']] = null;
      });
    },
  },
  extraReducers: (builder) => {
    // Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading.categories = true;
        state.errors.categories = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading.categories = false;
        state.categories = action.payload.categories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading.categories = false;
        state.errors.categories = action.payload as string;
      });
    
    // Items
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading.items = true;
        state.errors.items = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading.items = false;
        state.items = action.payload.items;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading.items = false;
        state.errors.items = action.payload as string;
      });
    
    // Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading.orders = true;
        state.errors.orders = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.orders = action.payload.orders;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.errors.orders = action.payload as string;
      });
    
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading.creatingOrder = true;
        state.errors.creatingOrder = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading.creatingOrder = false;
        state.orders.unshift(action.payload);
        // Clear cart after successful order
        state.cart = {
          items: [],
          totalAmount: 0,
          totalItems: 0,
        };
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading.creatingOrder = false;
        state.errors.creatingOrder = action.payload as string;
      });
    
    // Stock Requests
    builder
      .addCase(fetchStockRequests.pending, (state) => {
        state.loading.stockRequests = true;
        state.errors.stockRequests = null;
      })
      .addCase(fetchStockRequests.fulfilled, (state, action) => {
        state.loading.stockRequests = false;
        state.stockRequests = action.payload.requests;
      })
      .addCase(fetchStockRequests.rejected, (state, action) => {
        state.loading.stockRequests = false;
        state.errors.stockRequests = action.payload as string;
      });
    
    builder
      .addCase(createStockRequest.pending, (state) => {
        state.loading.creatingStockRequest = true;
        state.errors.creatingStockRequest = null;
      })
      .addCase(createStockRequest.fulfilled, (state, action) => {
        state.loading.creatingStockRequest = false;
        state.stockRequests.unshift(action.payload);
      })
      .addCase(createStockRequest.rejected, (state, action) => {
        state.loading.creatingStockRequest = false;
        state.errors.creatingStockRequest = action.payload as string;
      });
    
    // Hire Records
    builder
      .addCase(fetchHireRecords.pending, (state) => {
        state.loading.hireRecords = true;
        state.errors.hireRecords = null;
      })
      .addCase(fetchHireRecords.fulfilled, (state, action) => {
        state.loading.hireRecords = false;
        state.hireRecords = action.payload.records;
      })
      .addCase(fetchHireRecords.rejected, (state, action) => {
        state.loading.hireRecords = false;
        state.errors.hireRecords = action.payload as string;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  setItemFilters,
  clearItemFilters,
  clearError,
  clearAllErrors,
} = storeSlice.actions;

export default storeSlice.reducer;
