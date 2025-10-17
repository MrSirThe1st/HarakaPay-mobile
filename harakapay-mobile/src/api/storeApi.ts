// harakapay-mobile/src/api/storeApi.ts
import { 
  StoreCategory, 
  StoreItem, 
  StoreOrder, 
  HireRecord, 
  StockRequest,
  StoreApiResponse, 
  StorePaginationData, 
  StoreStatsData,
  StoreItemFilters,
  StoreOrderFilters,
  CreateOrderData,
  StockRequestFormData
} from '../types/store';

// Generic API call function
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<StoreApiResponse<T>> => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
};

// Store Categories API
export const storeCategoriesApi = {
  getAll: async (page = 1, limit = 50) => {
    return apiCall<{
      categories: StoreCategory[];
      pagination: StorePaginationData;
      stats: StoreStatsData;
    }>(`/api/school/store/categories?page=${page}&limit=${limit}`);
  },
};

// Store Items API
export const storeItemsApi = {
  getAll: async (page = 1, limit = 50, filters?: StoreItemFilters) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    
    return apiCall<{
      items: StoreItem[];
      pagination: StorePaginationData;
      stats: StoreStatsData;
    }>(`/api/school/store/items?${params}`);
  },

  getById: async (id: string) => {
    return apiCall<{ item: StoreItem }>(`/api/school/store/items/${id}`);
  },
};

// Store Orders API
export const storeOrdersApi = {
  getAll: async (page = 1, limit = 50, filters?: StoreOrderFilters) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    
    return apiCall<{
      orders: StoreOrder[];
      pagination: StorePaginationData;
      stats: StoreStatsData;
    }>(`/api/school/store/orders?${params}`);
  },

  getById: async (id: string) => {
    return apiCall<{ order: StoreOrder }>(`/api/school/store/orders/${id}`);
  },

  create: async (data: CreateOrderData) => {
    return apiCall<{ order: StoreOrder }>('/api/school/store/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Stock Requests API
export const stockRequestsApi = {
  getAll: async (page = 1, limit = 50) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    return apiCall<{
      requests: StockRequest[];
      pagination: StorePaginationData;
      stats: StoreStatsData;
    }>(`/api/school/store/stock-requests?${params}`);
  },

  create: async (data: StockRequestFormData) => {
    return apiCall<{ request: StockRequest }>('/api/school/store/stock-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Hire Records API
export const hireRecordsApi = {
  getAll: async (page = 1, limit = 50, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    
    return apiCall<{
      records: HireRecord[];
      pagination: StorePaginationData;
      stats: StoreStatsData;
    }>(`/api/school/store/hire-records?${params}`);
  },
};

// Combined Store API
export const storeApi = {
  categories: storeCategoriesApi,
  items: storeItemsApi,
  orders: storeOrdersApi,
  stockRequests: stockRequestsApi,
  hireRecords: hireRecordsApi,
};
