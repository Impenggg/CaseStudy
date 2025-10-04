// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'artisan' | 'customer' | 'admin';
  avatar?: string;
  bio?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  cultural_background?: string;
  materials: string[];
  care_instructions: string;
  image: string;
  images: string[];
  user_id: number;
  seller: User;
  stock_quantity: number;
  dimensions?: {
    length: number;
    width: number;
    weight: number;
  };
  tags: string[];
  featured: boolean;
  moderation_status?: 'pending' | 'approved' | 'rejected';
  reviewed_by?: number;
  reviewed_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

// Story Types
export interface Story {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  media_url: string;
  media_type: 'image' | 'video';
  author_id: number;
  author: User;
  category: 'tradition' | 'technique' | 'artisan' | 'community';
  tags: string[];
  featured: boolean;
  published: boolean;
  reading_time: number;
  moderation_status?: 'pending' | 'approved' | 'rejected';
  reviewed_by?: number;
  reviewed_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

// Campaign Types
export interface Campaign {
  id: number;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  end_date: string;
  organizer_id: number;
  organizer: User;
  image: string;
  category: 'preservation' | 'education' | 'equipment' | 'community';
  status: 'active' | 'completed' | 'cancelled';
  backers_count: number;
  moderation_status?: 'pending' | 'approved' | 'rejected';
  reviewed_by?: number;
  reviewed_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

// Order Types
export interface Order {
  id: number;
  product_id: number;
  product: Product;
  buyer_id: number;
  buyer: User;
  quantity: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: Address;
  payment_method: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

// Donation Types
export interface Donation {
  id: number;
  campaign_id: number;
  campaign: Campaign;
  donor_id: number;
  donor: User;
  amount: number;
  message?: string;
  anonymous: boolean;
  payment_method: string;
  created_at: string;
}

// Campaign Expenditure Types
export interface CampaignExpenditure {
  id: number;
  campaign_id: number;
  title: string;
  description?: string;
  amount: number;
  used_at?: string;
  attachment_path?: string;
  created_by: number;
  creator?: { id: number; name: string };
  created_at: string;
  updated_at: string;
}

// Address Types
export interface Address {
  street: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  phone?: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Filter Types
export interface ProductFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: 'price_asc' | 'price_desc' | 'popularity' | 'newest';
  search?: string;
  tags?: string[];
}

export interface StoryFilters {
  category?: string;
  search?: string;
  tags?: string[];
  sortBy?: 'newest' | 'oldest' | 'featured';
}

export interface CampaignFilters {
  category?: string;
  status?: string;
  search?: string;
  sortBy?: 'newest' | 'ending_soon' | 'most_funded';
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    per_page: number;
    total_count: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'artisan' | 'customer';
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Media Types
export interface MediaPost {
  id: number;
  user_id: number;
  caption?: string;
  image_path: string;
  image_url: string;
  moderation_status?: 'pending' | 'approved' | 'rejected';
  reviewed_by?: number;
  reviewed_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  user?: { id: number; name: string };
  reactions_count?: number;
  comments_count?: number;
  comments?: MediaComment[];
}

export interface MediaComment {
  id: number;
  media_post_id: number;
  user_id: number;
  body: string;
  moderation_status?: 'pending' | 'approved' | 'rejected';
  reviewed_by?: number;
  reviewed_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  user?: { id: number; name: string };
}

// Analytics Types
export interface SellerAnalytics {
  total_sales: number;
  total_orders: number;
  total_revenue: number;
  popular_products: Product[];
  recent_orders: Order[];
  monthly_revenue: {
    month: string;
    revenue: number;
  }[];
}
