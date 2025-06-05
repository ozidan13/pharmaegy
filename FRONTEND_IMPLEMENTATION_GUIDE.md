# Pharma Connect - Frontend Implementation Guide

## Project Overview

Pharma Connect is a comprehensive platform that connects pharmacists with pharmacy owners, featuring subscription-based services, payment processing, and inventory management. The frontend will be built with Next.js 15, React 19, TypeScript, and Tailwind CSS, following Apple's design principles for a premium user experience.

## Design Philosophy - Apple-Inspired UI/UX

Based on Apple's MacBook Air design language, our frontend will feature:

### Visual Design Principles
- **Clean Minimalism**: Abundant white space, subtle shadows, and clean typography
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Premium Color Palette**: 
  - Primary: Clean blues (#007AFF, #0066CC)
  - Secondary: Elegant grays (#F2F2F7, #8E8E93)
  - Accent: Sky blue (#87CEEB) for highlights
  - Success: Green (#34C759)
  - Warning: Orange (#FF9500)
  - Error: Red (#FF3B30)
- **Typography**: SF Pro Display-inspired fonts (using Geist Sans)
- **Glassmorphism Effects**: Subtle blur effects and transparency
- **Rounded Corners**: Consistent 8px, 12px, 16px border radius
- **Depth**: Layered cards with subtle shadows

### Interaction Patterns
- **Hover States**: Subtle scale transforms (scale: 1.02)
- **Button Animations**: Smooth color transitions and gentle press effects
- **Loading States**: Elegant skeleton screens and spinners
- **Form Validation**: Real-time, non-intrusive feedback
- **Navigation**: Smooth page transitions with fade effects

## Global Styling Architecture

### Apple-Inspired Design System Implementation

#### 1. CSS Architecture Strategy

**Global CSS Foundation** (`src/app/globals.css`)
```css
/* Apple-inspired CSS Custom Properties */
:root {
  /* Color System - Apple's approach */
  --color-primary: #007AFF;
  --color-primary-hover: #0066CC;
  --color-secondary: #5856D6;
  --color-success: #34C759;
  --color-warning: #FF9500;
  --color-error: #FF3B30;
  --color-sky-blue: #87CEEB;
  
  /* Neutral Palette */
  --color-white: #FFFFFF;
  --color-gray-50: #F2F2F7;
  --color-gray-100: #E5E5EA;
  --color-gray-200: #D1D1D6;
  --color-gray-300: #C7C7CC;
  --color-gray-400: #AEAEB2;
  --color-gray-500: #8E8E93;
  --color-gray-600: #636366;
  --color-gray-700: #48484A;
  --color-gray-800: #3A3A3C;
  --color-gray-900: #1C1C1E;
  --color-black: #000000;
  
  /* Typography Scale */
  --font-family-primary: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono: var(--font-geist-mono), 'SF Mono', Monaco, 'Cascadia Code', monospace;
  
  /* Font Sizes - Apple's scale */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  --text-6xl: 3.75rem;    /* 60px */
  
  /* Spacing System - 8px grid */
  --space-1: 0.25rem;     /* 4px */
  --space-2: 0.5rem;      /* 8px */
  --space-3: 0.75rem;     /* 12px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-8: 2rem;        /* 32px */
  --space-10: 2.5rem;     /* 40px */
  --space-12: 3rem;       /* 48px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
  
  /* Border Radius - Apple's approach */
  --radius-sm: 0.375rem;   /* 6px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
  --radius-2xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;
  
  /* Shadows - Apple's depth system */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  /* Transitions - Apple's timing */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.8);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-blur: blur(20px);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #0A84FF;
    --color-primary-hover: #409CFF;
    --glass-bg: rgba(28, 28, 30, 0.8);
    --glass-border: rgba(255, 255, 255, 0.1);
  }
}

/* Global base styles */
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-family-primary);
  background: var(--color-white);
  color: var(--color-gray-900);
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

/* Apple-style focus states */
*:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Smooth animations for all elements */
* {
  transition: transform var(--transition-fast), 
              opacity var(--transition-fast),
              background-color var(--transition-fast),
              border-color var(--transition-fast),
              color var(--transition-fast),
              box-shadow var(--transition-fast);
}

/* Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### 2. Tailwind CSS Configuration Enhancement

**Updated `tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Apple-inspired color palette
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        'sky-blue': 'var(--color-sky-blue)',
        gray: {
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
        },
      },
      
      // Apple's font families
      fontFamily: {
        sans: ['var(--font-geist-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'SF Mono', 'Monaco', 'Cascadia Code', 'monospace'],
      },
      
      // Apple's spacing system
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
        '20': 'var(--space-20)',
        '24': 'var(--space-24)',
      },
      
      // Apple's border radius
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        'full': 'var(--radius-full)',
      },
      
      // Apple's shadow system
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
      },
      
      // Apple's transitions
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
      },
      
      // Apple's cubic bezier
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      // Glassmorphism utilities
      backdropBlur: {
        'glass': '20px',
      },
      
      // Apple-style animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
          '70%': { transform: 'translate3d(0, -4px, 0)' },
          '90%': { transform: 'translate3d(0, -2px, 0)' },
        },
      },
    },
  },
  plugins: [
    // Custom plugin for Apple-style components
    function({ addComponents, theme }) {
      addComponents({
        // Apple-style buttons
        '.btn-apple': {
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.base'),
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            transform: 'scale(1.02)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        
        '.btn-primary': {
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'var(--color-primary-hover)',
          },
        },
        
        // Apple-style cards
        '.card-apple': {
          backgroundColor: 'white',
          borderRadius: theme('borderRadius.xl'),
          boxShadow: 'var(--shadow-md)',
          padding: theme('spacing.6'),
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: 'var(--shadow-lg)',
            transform: 'translateY(-2px)',
          },
        },
        
        // Glassmorphism effect
        '.glass': {
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
        },
        
        // Apple-style inputs
        '.input-apple': {
          padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.lg'),
          border: '1px solid var(--color-gray-300)',
          fontSize: theme('fontSize.base'),
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:focus': {
            outline: 'none',
            borderColor: 'var(--color-primary)',
            boxShadow: '0 0 0 3px rgba(0, 122, 255, 0.1)',
          },
        },
      })
    },
  ],
}
```

#### 3. Performance Optimization Strategy

**CSS Caching & Loading Optimization**

1. **Critical CSS Inlining**
   - Inline critical above-the-fold styles
   - Defer non-critical CSS loading
   - Use `next/font` for optimal font loading

2. **CSS Purging & Minification**
   - Tailwind's built-in purging removes unused styles
   - Production builds automatically minify CSS
   - Tree-shake unused design tokens

3. **Asset Optimization**
   ```javascript
   // next.config.js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     experimental: {
       optimizeCss: true, // Enable CSS optimization
     },
     compiler: {
       removeConsole: process.env.NODE_ENV === 'production',
     },
     images: {
       formats: ['image/webp', 'image/avif'],
       deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
     },
   }
   ```

4. **Font Loading Strategy**
   ```typescript
   // Enhanced font loading in layout.tsx
   import { Geist, Geist_Mono } from "next/font/google";
   
   const geistSans = Geist({
     variable: "--font-geist-sans",
     subsets: ["latin"],
     display: 'swap', // Optimal font loading
     preload: true,
   });
   
   const geistMono = Geist_Mono({
     variable: "--font-geist-mono",
     subsets: ["latin"],
     display: 'swap',
     preload: false, // Only load when needed
   });
   ```

#### 4. Component-Level Styling Strategy

**Reusable Style Patterns**

1. **Design Tokens as CSS Variables**
   - All colors, spacing, and typography use CSS custom properties
   - Easy theme switching and customization
   - Consistent values across the entire application

2. **Utility-First with Component Classes**
   - Use Tailwind utilities for layout and spacing
   - Create component classes for complex patterns
   - Combine both approaches for maximum efficiency

3. **Conditional Styling Patterns**
   ```typescript
   // Example: Apple-style button component
   const buttonVariants = {
     primary: 'btn-apple btn-primary',
     secondary: 'btn-apple bg-gray-100 text-gray-900 hover:bg-gray-200',
     ghost: 'btn-apple bg-transparent text-primary hover:bg-primary/10',
   }
   ```

#### 5. Caching Strategy

**Browser Caching**
- CSS files cached with long expiration times
- Versioned filenames for cache busting
- Service worker for offline CSS caching

**Build-time Optimization**
- CSS extraction and deduplication
- Automatic vendor prefixing
- Critical CSS identification

**Runtime Performance**
- CSS-in-JS avoided for better performance
- Minimal runtime style calculations
- Efficient re-renders with stable class names

## Technical Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS with Apple-inspired design system
- **State Management**: React Context API + Custom hooks
- **Authentication**: JWT with HTTP-only cookies
- **File Uploads**: Multer integration
- **Database**: PostgreSQL with Prisma ORM
- **Animations**: Framer Motion + CSS transitions
- **Performance**: CSS-in-JS caching, asset optimization
- **Fonts**: Geist Sans/Mono (Apple SF Pro inspired)

## Database Schema Overview

### User Roles
- **PHARMACIST**: Can search for jobs, manage profile, upload CV
- **PHARMACY_OWNER**: Can post jobs, manage inventory, search pharmacists
- **ADMIN**: Can manage users, payments, and system settings

### Subscription Plans
- **FREE**: Basic features
- **STANDARD**: Enhanced features (20 EGP)
- **PREMIUM**: Full features (40 EGP)

## API Endpoints Summary

### Authentication
- `POST /api/v1/auth/register/pharmacists`
- `POST /api/v1/auth/register/pharmacy-owners`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/admin/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### Pharmacist Endpoints
- `GET /api/v1/pharmacists/me`
- `PUT /api/v1/pharmacists/me`
- `GET /api/v1/pharmacists/search`
- `POST /api/v1/pharmacists/me/cv`
- `GET /api/v1/pharmacists/me/cv`

### Pharmacy Owner Endpoints
- `GET /api/v1/pharmacy-owners/me`
- `PUT /api/v1/pharmacy-owners/me`

### Store/Products
- `GET /api/v1/store/products`
- `POST /api/v1/store/products`
- `PUT /api/v1/store/products/:id`
- `DELETE /api/v1/store/products/:id`

### Subscriptions
- `GET /api/v1/subscriptions/pricing`
- `GET /api/v1/subscriptions/me`
- `POST /api/v1/subscriptions/request-change`
- `PATCH /api/v1/subscriptions/submit-payment`

### Admin
- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/payments`
- `PATCH /api/v1/admin/payments/:id/confirm`
- `PATCH /api/v1/admin/payments/:id/reject`

---

# Frontend Pages Implementation Plan

## Phase 1: Authentication & Core Layout

### 1. Landing Page (`/`)
**Status**: ✅ Partially Implemented
**Enhancements Needed**: Apple-style redesign

#### Implementation Steps:
1. **Hero Section Redesign**
   - just one Large Hero Section with full widyh hieght view with elegent bold typography with gradient text effects for 3 main buttons ( SIGN up as pharmacist and as pharmacy owner and sign in)
   - Large, bold typography with gradient text effects for 3 main buttons ( SIGN up as pharmacist and as pharmacy owner and sign in)
   - Animated background with subtle particle effects
   - Call-to-action buttons with hover animations
   - Glassmorphism effect cards
   - Hover animations with scale and shadow effects
   - Icon animations on hover
   

3. **Navigation Enhancement**
   - Sticky navigation with blur effect
   - Smooth scroll animations
   - Mobile-responsive hamburger menu
   - Smooth transitions between states

#### Components to Create:
- `HeroSection.tsx`
- `AnimatedButton.tsx`
- `ParticleBackground.tsx`

### 2. Authentication Pages

#### 2.1 Login Page (`/auth/login`)
**Status**: 🔄 Needs Implementation

#### Implementation Steps:
1. **Layout Design**
   - Split-screen layout with image/illustration on left
   - Clean, centered form on right
   - Subtle background patterns

2. **Form Components**
   - Floating label inputs
   - Password visibility toggle
   - Remember me checkbox
   - Social login buttons (future)

3. **Validation & UX**
   - Real-time validation with smooth error states
   - Loading states with skeleton screens
   - Success animations

#### Components to Create:
- `LoginForm.tsx`
- `FloatingLabelInput.tsx`
- `PasswordInput.tsx`
- `AuthLayout.tsx`

#### 2.2 Registration Pages
**Status**: 🔄 Needs Implementation

##### Pharmacist Registration (`/auth/register/pharmacist`)
#### Implementation Steps:
1. **Multi-step Form**
   - Step 1: Basic Information (email, password, name)
   - Step 2: Professional Details (experience, education)
   - Step 3: Location & Bio
   - Step 4: CV Upload

2. **Progress Indicator**
   - Animated progress bar
   - Step completion indicators
   - Navigation between steps

3. **File Upload**
   - Drag & drop CV upload
   - File preview and validation
   - Progress indicators

#### Components to Create:
- `MultiStepForm.tsx`
- `ProgressIndicator.tsx`
- `FileUpload.tsx`
- `LocationSelector.tsx`

##### Pharmacy Owner Registration (`/auth/register/pharmacy-owner`)
#### Implementation Steps:
1. **Business Information Form**
   - Pharmacy details
   - Contact information
   - Location data

2. **Verification Process**
   - Business license upload
   - Contact verification

#### Components to Create:
- `BusinessInfoForm.tsx`
- `DocumentUpload.tsx`

#### 2.3 Admin Login (`/auth/admin`)
**Status**: 🔄 Needs Implementation

#### Implementation Steps:
1. **Secure Admin Interface**
   - Minimalist design
   - Two-factor authentication UI
   - Security indicators

---

## Phase 2: Dashboard Pages

### 3. Pharmacist Dashboard (`/pharmacist/dashboard`)
**Status**: ✅ Basic Implementation
**Enhancements Needed**: Apple-style redesign

#### Implementation Steps:
1. **Dashboard Layout**
   - Grid-based card system
   - Responsive design
   - Sidebar navigation

2. **Statistics Cards**
   - Animated counters
   - Progress indicators
   - Trend charts

3. **Quick Actions**
   - Large, accessible buttons
   - Icon animations
   - Contextual actions

4. **Recent Activity Feed**
   - Timeline component
   - Real-time updates
   - Infinite scroll

#### Components to Create:
- `DashboardGrid.tsx`
- `StatCard.tsx`
- `QuickActions.tsx`
- `ActivityFeed.tsx`
- `TrendChart.tsx`

### 4. Pharmacy Owner Dashboard (`/pharmacy-owner/dashboard`)
**Status**: 🔄 Needs Implementation

#### Implementation Steps:
1. **Business Overview**
   - Revenue charts
   - Inventory status
   - Staff management

2. **Pharmacist Management**
   - Search and filter interface
   - Application tracking
   - Communication tools

3. **Analytics Section**
   - Interactive charts
   - Performance metrics
   - Export functionality

#### Components to Create:
- `BusinessOverview.tsx`
- `RevenueChart.tsx`
- `InventoryStatus.tsx`
- `PharmacistSearch.tsx`
- `ApplicationTracker.tsx`

### 5. Admin Dashboard (`/admin/dashboard`)
**Status**: 🔄 Needs Implementation

#### Implementation Steps:
1. **System Overview**
   - User statistics
   - Revenue tracking
   - System health

2. **Management Tools**
   - User management interface
   - Payment processing
   - System configuration

#### Components to Create:
- `AdminOverview.tsx`
- `UserManagement.tsx`
- `PaymentProcessor.tsx`
- `SystemHealth.tsx`

---

## Phase 3: Profile Management

### 6. Pharmacist Profile (`/pharmacist/profile`)
**Status**: 🔄 Needs Implementation

#### Implementation Steps:
1. **Profile Header**
   - Avatar upload with crop functionality
   - Professional headline
   - Availability status toggle

2. **Professional Information**
   - Editable sections
   - Rich text editor for bio
   - Experience timeline

3. **CV Management**
   - Upload/replace CV
   - Preview functionality
   - Download options

4. **Skills & Certifications**
   - Tag-based skill system
   - Certification uploads
   - Verification badges

#### Components to Create:
- `ProfileHeader.tsx`
- `AvatarUpload.tsx`
- `RichTextEditor.tsx`
- `ExperienceTimeline.tsx`
- `CVManager.tsx`
- `SkillTags.tsx`

### 7. Pharmacy Owner Profile (`/pharmacy-owner/profile`)
**Status**: 🔄 Needs Implementation

#### Implementation Steps:
1. **Business Profile**
   - Pharmacy information
   - Contact details
   - Location management

2. **Business Verification**
   - License management
   - Verification status
   - Document uploads

#### Components to Create:
- `BusinessProfile.tsx`
- `LocationManager.tsx`
- `VerificationStatus.tsx`
- `BusinessDocuments.tsx`

---

## Phase 4: Subscription & Payment System

### 8. Subscription Management (`/pharmacist/subscriptions`, `/pharmacy-owner/subscriptions`)
**Status**: 🔄 Needs Implementation

#### Implementation Steps:
1. **Plan Comparison**
   - Interactive pricing table
   - Feature comparison
   - Upgrade/downgrade flows

2. **Current Subscription**
   - Status indicators
   - Usage metrics
   - Renewal management

3. **Payment History**
   - Transaction list
   - Invoice downloads
   - Payment methods

#### Components to Create:
- `PricingTable.tsx`
- `SubscriptionStatus.tsx`
- `PaymentHistory.tsx`
- `UpgradeFlow.tsx`

### 9. Payment Pages (`/pharmacist/payments`, `/pharmacy-owner/payments`)
**Status**: 🔄 Needs Implementation

#### Implementation Steps:
1. **Payment Request Flow**
   - Plan selection
   - Payment method choice
   - Confirmation screens

2. **Wallet Integration**
   - Wallet address display
   - QR code generation
   - Transaction tracking

3. **Payment Proof Upload**
   - Image upload
   - Transaction hash input
   - Status tracking

#### Components to Create:
- `PaymentFlow.tsx`
- `WalletDisplay.tsx`
- `QRCodeGenerator.tsx`
- `ProofUpload.tsx`
- `TransactionTracker.tsx`

---

## Phase 5: Inventory & Store Management

### 10. Store Management (`/pharmacy-owner/store`)
**Status**: 🔄 Needs Implementation

#### Implementation Steps:
1. **Product Grid**
   - Responsive product cards
   - Search and filter
   - Bulk actions

2. **Product Management**
   - Add/edit product forms
   - Image upload
   - Inventory tracking

3. **Categories & Organization**
   - Category management
   - Product organization
   - Bulk operations

#### Components to Create:
- `ProductGrid.tsx`
- `ProductCard.tsx`
- `ProductForm.tsx`
- `ImageUpload.tsx`
- `CategoryManager.tsx`
- `BulkActions.tsx`

### 11. Inventory Management (`/pharmacy-owner/inventory`)
**Status**: 🔄 Needs Implementation

#### Implementation Steps:
1. **Inventory Overview**
   - Stock levels
   - Low stock alerts
   - Expiry tracking

2. **Stock Management**
   - Add/remove stock
   - Batch tracking
   - Supplier management

#### Components to Create:
- `InventoryOverview.tsx`
- `StockLevels.tsx`
- `ExpiryTracker.tsx`
- `StockManager.tsx`
- `SupplierManager.tsx`

### 12. Public Store (`/products`)
**Status**: ✅ Basic Implementation
**Enhancements Needed**: Apple-style redesign

#### Implementation Steps:
1. **Product Catalog**
   - Beautiful product grid
   - Advanced filtering
   - Search functionality

2. **Product Details**
   - Detailed product pages
   - Image galleries
   - Pharmacy information

#### Components to Create:
- `ProductCatalog.tsx`
- `ProductFilter.tsx`
- `ProductDetail.tsx`
- `ImageGallery.tsx`
- `PharmacyInfo.tsx`

---

## Phase 6: Search & Discovery

### 13. Pharmacist Search (`/pharmacy-owner/pharmacists`)
**Status**: 🔄 Needs Implementation

#### Implementation Steps:
1. **Search Interface**
   - Advanced filters
   - Map integration
   - Saved searches

2. **Pharmacist Profiles**
   - Profile cards
   - Quick contact
   - Comparison tools

3. **Application Management**
   - Application tracking
   - Communication tools
   - Interview scheduling

#### Components to Create:
- `PharmacistSearch.tsx`
- `SearchFilters.tsx`
- `MapIntegration.tsx`
- `PharmacistCard.tsx`
- `ApplicationManager.tsx`
- `ContactTools.tsx`

---

## Phase 7: Admin Panel

### 14. User Management (`/admin/users`)
**Status**: 🔄 Needs Implementation

#### Implementation Steps:
1. **User Overview**
   - User statistics
   - Activity monitoring
   - Role management

2. **User Actions**
   - Account management
   - Suspension/activation
   - Communication tools

#### Components to Create:
- `UserOverview.tsx`
- `UserTable.tsx`
- `UserActions.tsx`
- `ActivityMonitor.tsx`

### 15. Payment Management (`/admin/payments`)
**Status**: 🔄 Needs Implementation

#### Implementation Steps:
1. **Payment Queue**
   - Pending payments
   - Review interface
   - Bulk actions

2. **Payment Processing**
   - Approval/rejection
   - Notes and comments
   - Audit trail

#### Components to Create:
- `PaymentQueue.tsx`
- `PaymentReview.tsx`
- `PaymentActions.tsx`
- `AuditTrail.tsx`

### 16. Wallet Configuration (`/admin/wallet`)
**Status**: 🔄 Needs Implementation

#### Implementation Steps:
1. **Wallet Management**
   - Address configuration
   - Security settings
   - Backup procedures

#### Components to Create:
- `WalletConfig.tsx`
- `SecuritySettings.tsx`
- `BackupManager.tsx`

---

## Shared Components Library

### Core UI Components
1. **Layout Components**
   - `AppLayout.tsx`
   - `Sidebar.tsx`
   - `Header.tsx`
   - `Footer.tsx`

2. **Form Components**
   - `Input.tsx`
   - `Select.tsx`
   - `Textarea.tsx`
   - `Checkbox.tsx`
   - `Radio.tsx`
   - `FileUpload.tsx`

3. **UI Elements**
   - `Button.tsx`
   - `Card.tsx`
   - `Modal.tsx`
   - `Tooltip.tsx`
   - `Badge.tsx`
   - `Avatar.tsx`
   - `Spinner.tsx`

4. **Data Display**
   - `Table.tsx`
   - `Pagination.tsx`
   - `EmptyState.tsx`
   - `ErrorBoundary.tsx`

5. **Navigation**
   - `Breadcrumb.tsx`
   - `Tabs.tsx`
   - `Steps.tsx`

### Custom Hooks
1. **API Hooks**
   - `useApi.ts`
   - `useAuth.ts`
   - `useSubscription.ts`
   - `usePayments.ts`

2. **UI Hooks**
   - `useModal.ts`
   - `useToast.ts`
   - `useLocalStorage.ts`
   - `useDebounce.ts`

### Utilities
1. **API Client**
   - `apiClient.ts`
   - `endpoints.ts`
   - `types.ts`

2. **Helpers**
   - `formatters.ts`
   - `validators.ts`
   - `constants.ts`

---

## Implementation Timeline

### Week 1-2: Foundation
- Set up Apple-inspired design system
- Create core components library
- Implement authentication pages
- Set up routing and navigation

### Week 3-4: Dashboard & Profiles
- Build dashboard pages for all user types
- Implement profile management
- Create subscription interfaces

### Week 5-6: Store & Inventory
- Build store management system
- Implement inventory tracking
- Create public product catalog

### Week 7-8: Search & Admin
- Implement pharmacist search
- Build admin panel
- Add payment processing interfaces

### Week 9-10: Polish & Testing
- Add animations and micro-interactions
- Implement responsive design
- Performance optimization
- Testing and bug fixes

---

## Development Guidelines

### Code Standards
- TypeScript strict mode
- ESLint + Prettier configuration
- Component-driven development
- Atomic design principles

### Performance
- Code splitting by route
- Image optimization
- Lazy loading
- Caching strategies

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast standards

### Testing
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Playwright
- Visual regression testing

---

## Next Steps

1. **Review this documentation** with the development team
2. **Set up the development environment** with required dependencies
3. **Create the design system** and component library
4. **Begin Phase 1 implementation** starting with the landing page redesign
5. **Establish the review process** for each completed page

This comprehensive guide provides a roadmap for creating a premium, Apple-inspired frontend that will elevate the Pharma Connect platform to professional standards while maintaining excellent user experience across all user types.