# 🏍️ Heshan Moto - Premium Motorcycle Platform

A modern, production-ready React application for motorcyclemanagement, leasing, and test drive bookings with exceptional UI/UX.

## ✨ Features

### Core Features
- **Motorcycle Catalog** - Browse, search, and filter motorcycles by category
- **Advanced Search** - Real-time search with pagination and category filtering
- **Motorcycle Details** - Comprehensive motorcycle information with image gallery
- **Test Drive Bookings** - Easy booking system for test rides
- **Inquiry System** - Send inquiries directly from motorcycle details
- **User Profiles** - Manage personal information and preferences
- **Leasing Plans** - Flexible leasing options with three tier pricing
- **Contact Management** - Modern contact form with validation

### Admin Features
- **Dashboard** - Overview of users, inquiries, and bookings
- **User Management** - Manage user roles and permissions
- **Motorcycle Management** - Add, edit motorcycles with image upload to Supabase
- **Analytics** - View statistics and manage data

### UI/UX Enhancements
- **Toast Notifications** - Non-intrusive feedback system
- **Loading Skeletons** - Smooth loading states for better perceived performance
- **Modal Dialogs** - Confirmation modals for critical actions
- **Empty & Error States** - Helpful messages for all scenarios
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Smooth Animations** - Modern transitions and entrance animations
- **Professional Footer** - Complete footer with links and information

## 🎨 Design System

### Color Palette
- **Primary**: Sky Blue (`sky-500`)
- **Secondary**: Slate (`slate-*`)
- **Accent**: Amber (`amber-400`)
- **Success**: Emerald (`emerald-500`)
- **Danger**: Red (`red-500`)
- **Warning**: Amber (`amber-500`)

### Typography
- **Display**: Bebas Neue (headings)
- **Body**: Manrope 400/600/700 (default)
- **Spacing**: Tailwind spacing scale (4px base unit)

### Component Library
- **Button** - Multiple variants (primary, secondary, outline, danger)
- **Input** - With labels, error states, and help text
- **Textarea** - Rich text input with validation
- **Select** - Custom select component
- **Badge** - Status indicators
- **Modal** - Dialog and confirmation modals
- **Empty State** - Friendly empty screens
- **Error State** - Error handling UI
- **Skeleton** - Loading placeholders

## 🛠️ Tech Stack

- **React 18** - UI library
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Supabase** - Backend (Auth, Storage)
- **Axios** - HTTP client

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone repository
git clone <repo-url>
cd frontend

# Install dependencies
npm install

# Create .env.local
touch .env.local

# Add environment variables (see .env.example)
VITE_API_BASE_URL=http://localhost:3000

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 639px
- **Tablet**: 640px - 1023px (sm:)
- **Desktop**: 1024px+ (lg:)

All pages are designed mobile-first and fully responsive.

## 🎯 Key Pages

- `/` - Home catalog
- `/motorcycles/:identifier` - Motorcycle details
- `/leasing-offer` - Leasing plans
- `/contact-us` - Contact form
- `/login` - Authentication
- `/register` - New user registration
- `/profile` - User profile management
- `/bookings` - View user bookings
- `/admin` - Admin dashboard (admin only)
- `/admin/motorcycles` - Manage motorcycles (admin only)
- `/admin/users` - Manage users (admin only)

## 🔐 Authentication

The app uses JWT-based authentication with:
- Email/password login
- Protected routes for authenticated users
- Admin-only routes
- Automatic token refresh
- Logout functionality

## 📋 Component Library Reference

### Layout Components
- `Layout` - Main app wrapper with navbar and footer
- `Footer` - Application footer
- `ProtectedRoute` - Auth guard component

### Form Components
- `Input` - Text input with validation
- `Textarea` - Multi-line text input
- `Select` - Dropdown select
- `Button` - Interactive button (multiple variants)
- `Badge` - Status badge

### Feedback Components
- `ToastContainer` - Toast notification display
- `Modal` - Dialog modal
- `ConfirmModal` - Confirmation dialog
- `EmptyState` - Empty state display
- `ErrorState` - Error state display
- `ErrorBoundary` - Error boundary wrapper

### Loading Components
- `SkeletonCard` - Card loading placeholder
- `SkeletonTable` - Table loading placeholder
- `SkeletonText` - Text loading placeholder
- `SkeletonGrid` - Grid loading placeholder
- `SkeletonHero` - Hero section loading placeholder

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This creates an optimized production build in `dist/`.

### Environment Variables for Production

```
VITE_API_BASE_URL=https://api.production.com
```

### Hosting Options
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static host

## 🔄 Toast Notifications

Use toast notifications for user feedback:

```tsx
import { useToast } from '@/context/ToastContext';

function MyComponent() {
  const { addToast } = useToast();
  
  const handleAction = () => {
    try {
      // Do something
      addToast('Success!', 'success');
    } catch (error) {
      addToast('Error occurred', 'error');
    }
  };
}
```

## 📊 Performance Optimizations

- Code splitting with React Router
- Image optimization with object-fit
- CSS is tree-shaken by Tailwind
- Production build optimization
- Lazy loading for routes
- Efficient re-renders with proper hooks usage

## 🎭 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Code Style

- TypeScript for type safety
- Tailwind CSS for styling (no custom CSS files)
- Functional components with hooks
- Proper error handling
- Accessible markup

## 🤝 Contributing

1. Create a feature branch
2. Follow the existing code style
3. Test changes locally
4. Submit pull request

## 📄 License

Licensed under MIT License

## 📞 Support

For support, contact us at: support@motorcyclehub.com

---

**Made with ❤️ by Heshan Moto Team**
