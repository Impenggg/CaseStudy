import axios from 'axios';
import { Product, Story, Campaign, User, Order, Donation } from '@/types';

// Configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    if (response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token);
    }
    return response.data;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'weaver' | 'buyer';
    bio?: string;
    location?: string;
    phone?: string;
  }) => {
    const response = await api.post('/register', userData);
    if (response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token);
    }
    return response.data;
  },

  logout: async () => {
    await api.post('/logout');
    localStorage.removeItem('auth_token');
  },

  getUser: async () => {
    const response = await api.get('/user');
    return response.data.data;
  },

  updateProfile: async (userData: Partial<User>) => {
    const response = await api.put('/user', userData);
    return response.data.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (params?: {
    search?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    sort_by?: string;
    featured?: boolean;
    per_page?: number;
    page?: number;
  }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  create: async (productData: Omit<Product, 'id' | 'user_id' | 'seller' | 'created_at' | 'updated_at'>) => {
    const response = await api.post('/products', productData);
    return response.data.data;
  },

  update: async (id: number, productData: Partial<Product>) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data.data;
  },

  delete: async (id: number) => {
    await api.delete(`/products/${id}`);
  },

  getMyProducts: async () => {
    const response = await api.get('/my-products');
    return response.data;
  },
};

// Stories API
export const storiesAPI = {
  getAll: async (params?: {
    search?: string;
    category?: string;
    sort_by?: string;
    featured?: boolean;
    per_page?: number;
    page?: number;
  }) => {
    const response = await api.get('/stories', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Story> => {
    const response = await api.get(`/stories/${id}`);
    return response.data.data;
  },

  create: async (storyData: Omit<Story, 'id' | 'author_id' | 'author' | 'views' | 'created_at' | 'updated_at'>) => {
    const response = await api.post('/stories', storyData);
    return response.data.data;
  },

  update: async (id: number, storyData: Partial<Story>) => {
    const response = await api.put(`/stories/${id}`, storyData);
    return response.data.data;
  },

  delete: async (id: number) => {
    await api.delete(`/stories/${id}`);
  },

  getMyStories: async () => {
    const response = await api.get('/my-stories');
    return response.data;
  },
};

// Campaigns API
export const campaignsAPI = {
  getAll: async (params?: {
    search?: string;
    category?: string;
    status?: string;
    sort_by?: string;
    per_page?: number;
    page?: number;
  }) => {
    const response = await api.get('/campaigns', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Campaign> => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data.data;
  },

  create: async (campaignData: Omit<Campaign, 'id' | 'organizer_id' | 'organizer' | 'current_amount' | 'backers_count' | 'created_at' | 'updated_at'>) => {
    const response = await api.post('/campaigns', campaignData);
    return response.data.data;
  },

  update: async (id: number, campaignData: Partial<Campaign>) => {
    const response = await api.put(`/campaigns/${id}`, campaignData);
    return response.data.data;
  },

  delete: async (id: number) => {
    await api.delete(`/campaigns/${id}`);
  },

  getMyCampaigns: async () => {
    const response = await api.get('/my-campaigns');
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getById: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },

  create: async (orderData: {
    product_id: number;
    quantity: number;
    shipping_address: {
      street: string;
      city: string;
      province: string;
      postal_code: string;
      country: string;
      phone?: string;
    };
    payment_method: string;
  }) => {
    const response = await api.post('/orders', orderData);
    return response.data.data;
  },

  update: async (id: number, orderData: Partial<Order>) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/my-orders');
    return response.data;
  },

  getMySales: async () => {
    const response = await api.get('/my-sales');
    return response.data;
  },
};

// Donations API
export const donationsAPI = {
  getAll: async () => {
    const response = await api.get('/donations');
    return response.data;
  },

  getById: async (id: number): Promise<Donation> => {
    const response = await api.get(`/donations/${id}`);
    return response.data.data;
  },

  create: async (donationData: {
    campaign_id: number;
    amount: number;
    message?: string;
    anonymous?: boolean;
    payment_method: string;
  }) => {
    const response = await api.post('/donations', donationData);
    return response.data.data;
  },

  getMyDonations: async () => {
    const response = await api.get('/my-donations');
    return response.data;
  },
};

// File Upload API
export const uploadAPI = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
