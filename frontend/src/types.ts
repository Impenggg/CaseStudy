// Minimal shared types used by API client. Extend as needed.

export type ID = number;

export interface User {
  id: ID;
  name: string;
  email: string;
  avatar?: string | null;
  role?: 'weaver' | 'buyer' | string;
  bio?: string;
  location?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: ID;
  user_id?: ID;
  seller?: User;
  name: string;
  description?: string;
  price: number;
  category?: string;
  cultural_background?: string;
  materials?: string[];
  care_instructions?: string;
  image?: string | null;
  images?: string[];
  stock_quantity?: number;
  dimensions?: { length?: number; width?: number; height?: number; weight?: number };
  tags?: string[];
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Story {
  id: ID;
  author_id?: ID;
  author?: User;
  title: string;
  body?: string;
  content?: string;
  excerpt?: string;
  media_url?: string;
  media_type?: 'image' | 'video' | string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
  reading_time?: number;
  views?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Campaign {
  id: ID;
  organizer_id?: ID;
  organizer?: User;
  title: string;
  description: string;
  goal_amount?: number;
  current_amount?: number;
  backers_count?: number;
  status?: string;
  end_date?: string;
  image?: string | null;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  product_id: ID;
  quantity: number;
}

export interface Order {
  id: ID;
  items?: OrderItem[];
  total?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Donation {
  id: ID;
  campaign_id: ID;
  amount: number;
  message?: string;
  anonymous?: boolean;
  created_at?: string;
  updated_at?: string;
}
