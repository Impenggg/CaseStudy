# Preserving Indigenous Weaving Through Digital Platforms

A full-stack web application dedicated to preserving Cordillera weaving culture through e-commerce, digital storytelling, and crowdfunding.

## Project Structure

```
CaseStudy/
├── frontend/                 # React + Vite + Tailwind + shadcn/ui
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   ├── data/           # Mock/placeholder data
│   │   └── styles/         # Global styles and Tailwind config
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── Requests/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   ├── routes/
│   ├── storage/
│   └── config/
└── docs/                   # Documentation and assets
```

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for high-quality components
- **React Router** for navigation
- **Axios** for API calls
- **React Query** for server state management

### Backend
- **Laravel 10** as REST API
- **Laravel Sanctum** for authentication
- **MySQL** database
- **Laravel Storage** for file uploads
- **Stripe/PayPal** integration (placeholder)

### Deployment
- **Frontend**: Vercel/Netlify
- **Backend**: Laravel Forge/DigitalOcean
- **Storage**: AWS S3/Laravel public storage
- **CDN**: Cloudflare

## Color Palette (Cordillera-inspired)

- `#E7EFC7` - Light cream green (highlights, section contrast)
- `#AEC8A4` - Sage green (card backgrounds, section fills)
- `#8A784E` - Muted brown gold (CTAs, buttons, accents)
- `#3B3B1A` - Deep olive (main dark background)

## Features

### Core Functionality
1. **E-commerce Marketplace**
   - Product listings with filters and search
   - Shopping cart and checkout
   - Order management

2. **Digital Storytelling**
   - Blog posts and articles
   - Photo galleries
   - Video content
   - Cultural background stories

3. **Crowdfunding Platform**
   - Campaign creation and management
   - Progress tracking
   - Donation processing

4. **User Management**
   - Authentication and authorization
   - User roles (weaver, buyer, admin)
   - Dashboard for content management

### Additional Features
- Image/video galleries with zoom and fullscreen
- Search and filtering
- Social media sharing
- Basic analytics
- Multilingual support structure
- Responsive design

## Getting Started

### Prerequisites
- Node.js 18+
- PHP 8.1+
- Composer
- MySQL 8.0+

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CaseStudy
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate --seed
   php artisan serve
   ```

## Development Notes

### Placeholder Content
All placeholder content is designed to be easily replaceable:
- Images use consistent naming conventions
- Content is stored in separate data files
- Cultural references are respectful and generic
- Easy migration path to real content

### API Structure
Following JSON:API standards for consistent response formats.

### Authentication
Using Laravel Sanctum for SPA authentication with React frontend.

## Contributing

Please ensure all cultural content is respectful and authentic to Cordillera weaving traditions.
