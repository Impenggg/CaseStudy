import { Product, Story, Campaign, User } from '@/types';

// PLACEHOLDER DATA - EASILY REPLACEABLE
// All images use placeholder services and can be replaced with actual content

// Sample Users
export const sampleUsers: User[] = [
  {
    id: 1,
    name: "Maria Santos",
    email: "maria@example.com",
    role: "weaver",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "Traditional weaver specializing in Ilocano textiles with 20+ years of experience.",
    location: "Baguio, Benguet",
    created_at: "2023-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    id: 2,
    name: "Juan Dela Cruz", 
    email: "juan@example.com",
    role: "weaver",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Preserving Kalinga weaving traditions through modern techniques.",
    location: "Tabuk, Kalinga",
    created_at: "2023-02-20T08:00:00Z",
    updated_at: "2024-02-20T08:00:00Z"
  },
  {
    id: 3,
    name: "Rosa Mendoza",
    email: "rosa@example.com", 
    role: "weaver",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Award-winning textile artist creating contemporary interpretations of traditional patterns.",
    location: "La Trinidad, Benguet",
    created_at: "2023-03-10T08:00:00Z",
    updated_at: "2024-03-10T08:00:00Z"
  }
];

// Sample Products
export const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Traditional Tapis Skirt",
    price: 2500,
    category: "clothing",
    description: "Handwoven traditional Ilocano tapis with intricate geometric patterns. Made from premium cotton threads using time-honored techniques passed down through generations.",
    cultural_background: "The tapis is a traditional wraparound skirt worn by Ilocano women, symbolizing femininity and cultural identity. Each pattern tells a story of our ancestral heritage.",
    materials: ["100% Cotton", "Natural Dyes", "Traditional Handloom"],
    care_instructions: "Hand wash only with mild soap. Air dry in shade. Iron on low heat if needed.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1564206280-50c4dc7b2077?w=400&h=400&fit=crop"
    ],
    user_id: 1,
    seller: sampleUsers[0],
    stock_quantity: 5,
    dimensions: { length: 100, width: 70, weight: 0.3 },
    tags: ["traditional", "clothing", "ilocano", "handwoven", "women"],
    featured: true,
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    id: 2,
    name: "Kalinga Blanket",
    price: 4500,
    category: "home-decor",
    description: "Authentic Kalinga blanket featuring traditional tribal patterns. Woven with natural cotton and colored with indigenous plant dyes.",
    cultural_background: "Kalinga blankets represent the tribe's connection to nature and their sophisticated understanding of textile design, developed over centuries.",
    materials: ["Organic Cotton", "Plant-based Dyes", "Bamboo Fiber"],
    care_instructions: "Gentle machine wash cold. Tumble dry low. Do not bleach.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop"
    ],
    user_id: 2,
    seller: sampleUsers[1],
    stock_quantity: 3,
    dimensions: { length: 200, width: 150, weight: 1.2 },
    tags: ["blanket", "kalinga", "tribal", "home-decor", "traditional"],
    featured: true,
    created_at: "2024-01-12T08:00:00Z",
    updated_at: "2024-01-18T08:00:00Z"
  },
  {
    id: 3,
    name: "Cordillera Table Runner",
    price: 1800,
    category: "home-decor",
    description: "Elegant table runner showcasing modern interpretations of traditional Cordillera motifs. Perfect for adding cultural elegance to any dining space.",
    cultural_background: "Contemporary design inspired by mountain terraces and traditional geometric patterns of the Cordillera region.",
    materials: ["Cotton Blend", "Synthetic Dyes", "Machine Woven"],
    care_instructions: "Machine washable. Iron on medium heat. Do not wring.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"
    ],
    user_id: 3,
    seller: sampleUsers[2],
    stock_quantity: 8,
    dimensions: { length: 180, width: 35, weight: 0.4 },
    tags: ["table-runner", "modern", "cordillera", "dining", "home-decor"],
    featured: false,
    created_at: "2024-01-14T08:00:00Z",
    updated_at: "2024-01-20T08:00:00Z"
  },
  {
    id: 4,
    name: "Traditional Bahag",
    price: 1200,
    category: "clothing",
    description: "Traditional Igorot bahag (loincloth) made with authentic patterns and natural materials. An important piece of cultural heritage.",
    cultural_background: "The bahag is traditional men's attire among Igorot tribes, representing strength, tradition, and cultural identity.",
    materials: ["Handspun Cotton", "Natural Indigo Dye", "Traditional Weave"],
    care_instructions: "Hand wash separately. Air dry completely. Store flat to maintain shape.",
    image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&h=400&fit=crop"
    ],
    user_id: 2,
    seller: sampleUsers[1],
    stock_quantity: 4,
    dimensions: { length: 120, width: 25, weight: 0.2 },
    tags: ["bahag", "traditional", "men", "igorot", "cultural"],
    featured: false,
    created_at: "2024-01-16T08:00:00Z",
    updated_at: "2024-01-22T08:00:00Z"
  }
];

// Sample Stories
export const sampleStories: Story[] = [
  {
    id: 1,
    title: "The Ancient Art of Ilocano Weaving",
    content: "For centuries, the people of Ilocos have perfected the art of textile weaving...",
    excerpt: "Discover the rich tradition of Ilocano weaving and its significance in preserving cultural heritage.",
    media_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    media_type: "image",
    author_id: 1,
    author: sampleUsers[0],
    category: "tradition",
    tags: ["ilocano", "weaving", "tradition", "heritage"],
    featured: true,
    published: true,
    reading_time: 5,
    created_at: "2024-01-08T08:00:00Z",
    updated_at: "2024-01-08T08:00:00Z"
  },
  {
    id: 2,
    title: "Modern Techniques in Traditional Kalinga Textiles",
    content: "How contemporary weavers are adapting age-old techniques to create modern masterpieces...",
    excerpt: "Learn how Kalinga weavers blend traditional methods with contemporary design principles.",
    media_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    media_type: "image",
    author_id: 2,
    author: sampleUsers[1],
    category: "technique",
    tags: ["kalinga", "modern", "technique", "innovation"],
    featured: true,
    published: true,
    reading_time: 7,
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-10T08:00:00Z"
  },
  {
    id: 3,
    title: "Portrait of a Master Weaver",
    content: "Meet Rosa Mendoza, whose innovative designs have won international recognition...",
    excerpt: "An intimate look at the life and work of award-winning textile artist Rosa Mendoza.",
    media_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop",
    media_type: "image",
    author_id: 3,
    author: sampleUsers[2],
    category: "artisan",
    tags: ["profile", "artist", "award", "innovation"],
    featured: false,
    published: true,
    reading_time: 4,
    created_at: "2024-01-12T08:00:00Z",
    updated_at: "2024-01-12T08:00:00Z"
  }
];

// Sample Campaigns
export const sampleCampaigns: Campaign[] = [
  {
    id: 1,
    title: "Preserve Traditional Looms for Future Generations",
    description: "Help us purchase and maintain traditional looms to teach young people the ancient art of weaving.",
    goal_amount: 150000,
    current_amount: 87500,
    end_date: "2024-06-30T23:59:59Z",
    organizer_id: 1,
    organizer: sampleUsers[0],
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    category: "preservation",
    status: "active",
    backers_count: 43,
    created_at: "2024-01-05T08:00:00Z",
    updated_at: "2024-01-20T08:00:00Z"
  },
  {
    id: 2,
    title: "Weaving Workshop for Indigenous Youth",
    description: "Fund educational workshops to teach traditional weaving techniques to indigenous youth in remote communities.",
    goal_amount: 75000,
    current_amount: 45300,
    end_date: "2024-05-15T23:59:59Z",
    organizer_id: 2,
    organizer: sampleUsers[1],
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
    category: "education",
    status: "active",
    backers_count: 28,
    created_at: "2024-01-08T08:00:00Z",
    updated_at: "2024-01-18T08:00:00Z"
  },
  {
    id: 3,
    title: "Community Weaving Center Construction",
    description: "Build a dedicated space where artisans can work, teach, and showcase their traditional weaving skills.",
    goal_amount: 300000,
    current_amount: 125000,
    end_date: "2024-08-31T23:59:59Z",
    organizer_id: 3,
    organizer: sampleUsers[2],
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
    category: "community",
    status: "active",
    backers_count: 67,
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-19T08:00:00Z"
  }
];

// Product Categories
export const productCategories = [
  { id: 'clothing', name: 'Traditional Clothing', count: 45 },
  { id: 'home-decor', name: 'Home Decoration', count: 32 },
  { id: 'accessories', name: 'Accessories', count: 28 },
  { id: 'bags', name: 'Bags & Pouches', count: 19 },
  { id: 'ceremonial', name: 'Ceremonial Items', count: 12 }
];

// Story Categories  
export const storyCategories = [
  { id: 'tradition', name: 'Traditional Stories', count: 15 },
  { id: 'technique', name: 'Weaving Techniques', count: 12 },
  { id: 'artisan', name: 'Artisan Profiles', count: 8 },
  { id: 'community', name: 'Community Stories', count: 6 }
];

// Campaign Categories
export const campaignCategories = [
  { id: 'preservation', name: 'Cultural Preservation', count: 8 },
  { id: 'education', name: 'Education & Training', count: 6 },
  { id: 'equipment', name: 'Tools & Equipment', count: 4 },
  { id: 'community', name: 'Community Development', count: 3 }
];
