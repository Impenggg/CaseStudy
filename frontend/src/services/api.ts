import axios from 'axios';
import type { Product, Story, Campaign, User, Order, Donation } from '@/types';

// Configure axios instance
const DEFAULT_API = 'http://localhost:8000/api';
let RESOLVED_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || DEFAULT_API;
// Guard against malformed base URLs like ':8000/api'
if (typeof RESOLVED_BASE_URL === 'string' && RESOLVED_BASE_URL.trim().startsWith(':')) {
  RESOLVED_BASE_URL = DEFAULT_API;
}
const api = axios.create({
  baseURL: RESOLVED_BASE_URL,
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
  if ((import.meta as any)?.env?.DEV && (config.url?.includes('/register') || config.url?.includes('/login'))) {
    try {
      console.debug('[API] Request:', { baseURL: config.baseURL, url: config.url, method: config.method, data: config.data });
    } catch {}
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove invalid token and preserve intended path for post-login redirect
      localStorage.removeItem('auth_token');
      try {
        const current = window.location.pathname + window.location.search + window.location.hash;
        if (!window.location.pathname.startsWith('/login')) {
          sessionStorage.setItem('intended_path', current);
        }
      } catch {}
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
    role: 'weaver' | 'customer';
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

export type MediaPost = {
  id: number;
  user_id: number;
  caption?: string;
  image_path: string;
  image_url: string;
  created_at: string;
  user?: { id: number; name: string };
  reactions_count?: number;
  comments_count?: number;
  comments?: Array<{ id: number; body: string; created_at: string; user?: { id: number; name: string } }>;
};

export const mediaAPI = {
  list: async (params?: { page?: number; per_page?: number }) => {
    const res = await api.get('/media', { params });
    return res.data as {
      data: MediaPost[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  },
  show: async (id: number) => {
    const res = await api.get(`/media/${id}`);
    return res.data as MediaPost;
  },
  userPosts: async (userId: number, params?: { page?: number; per_page?: number }) => {
    const res = await api.get(`/users/${userId}/media`, { params });
    return res.data as {
      data: MediaPost[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  },
  create: async ({ file, caption }: { file: File; caption?: string }) => {
    const form = new FormData();
    form.append('image', file);
    if (caption) form.append('caption', caption);
    const res = await api.post('/media', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  },
  react: async (id: number) => {
    const res = await api.post(`/media/${id}/react`);
    return res.data as { status: string; reacted: boolean; counts: { reactions_count: number; comments_count: number } };
  },
  comment: async (id: number, body: string) => {
    const res = await api.post(`/media/${id}/comments`, { body });
    return res.data;
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
    // JSON-based creation (no file). Kept for backward compatibility.
    const response = await api.post('/products', productData);
    return response.data.data;
  },

  createWithImage: async (payload: {
    name: string;
    price: number;
    category: string;
    description: string;
    cultural_background?: string;
    materials: string[];
    care_instructions: string;
    stock_quantity: number;
    dimensions?: Record<string, any>;
    tags?: string[];
    featured?: boolean;
    image: File; // main image file
  }) => {
    const form = new FormData();
    form.append('name', payload.name);
    form.append('price', String(payload.price));
    form.append('category', payload.category);
    form.append('description', payload.description);
    if (payload.cultural_background) form.append('cultural_background', payload.cultural_background);
    payload.materials.forEach((m, i) => form.append(`materials[${i}]`, m));
    form.append('care_instructions', payload.care_instructions);
    form.append('stock_quantity', String(payload.stock_quantity));
    if (payload.dimensions) form.append('dimensions', JSON.stringify(payload.dimensions));
    if (payload.tags) payload.tags.forEach((t, i) => form.append(`tags[${i}]`, t));
    if (typeof payload.featured === 'boolean') form.append('featured', String(payload.featured ? 1 : 0));
    form.append('image', payload.image);

    const response = await api.post('/products', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data as Product;
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
    per_page?: number | 'all';
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
    per_page?: number | 'all';
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

  batchCreate: async (payload: {
    items: Array<{ product_id: number; quantity: number }>;
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
    const response = await api.post('/orders/batch', payload);
    return response.data;
  },

  update: async (id: number, orderData: Partial<Order>) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data.data;
  },

  getOne: async (id: number) => {
    const response = await api.get(`/orders/${id}`);
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
  list: async (): Promise<Array<{ url: string; path: string; filename: string; size: number; mime_type: string; last_modified: number }>> => {
    const response = await api.get('/uploads');
    // backend returns { status, data: [...] }
    return response.data.data || [];
  },
};

export default api;
