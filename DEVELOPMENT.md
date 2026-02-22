# 👨‍💻 Development Guide

Comprehensive guide for developers working on the Heshan Moto project.

## 🎯 Project Overview

**Heshan Moto** is a premium motorcycle leasing and sales platform with:
- Modern React 18 frontend with Tailwind CSS
- TypeScript for type safety
- Comprehensive component library
- Production-ready authentication
- Admin dashboard for management

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ (verify with `node --version`)
- npm 9+ (verify with `npm --version`)
- Git
- VS Code (recommended) with extensions:
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin
  - ESLint
  - Prettier

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev

# Open browser to http://localhost:5174
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/              # Page components (one per route)
│   ├── components/         # Reusable UI components
│   ├── context/           # React context (Auth, Toast)
│   ├── lib/               # Utilities (api, helpers)
│   ├── types.ts           # TypeScript types
│   ├── App.tsx            # Main app with routing
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles + Tailwind imports
├── public/                # Static assets
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite build config
├── tailwind.config.js     # Tailwind CSS config
├── eslint.config.js       # ESLint rules
└── package.json           # Dependencies

```

## 🚀 Common Development Tasks

### Start Development Server
```bash
npm run dev
```
Runs on http://localhost:5174 with hot reload

### Build for Production
```bash
npm run build
```
Creates optimized `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Test production build locally

### Type Checking
```bash
npm run type-check
# or
tsc --noEmit
```

### Linting
```bash
# Check for issues
npm run lint

# Fix automatically fixable issues
npm run lint -- --fix
```

## 📝 Component Development

### Creating a New Component

```tsx
// src/components/MyComponent.tsx
import type { ReactNode } from 'react';

interface MyComponentProps {
  title: string;
  children: ReactNode;
  isActive?: boolean;
}

export function MyComponent({ title, children, isActive }: MyComponentProps) {
  return (
    <div className={`p-4 rounded-lg ${isActive ? 'bg-sky-500' : 'bg-slate-100'}`}>
      <h3 className="font-bold">{title}</h3>
      {children}
    </div>
  );
}
```

### Component Best Practices

1. **Use TypeScript** - Define all props with interfaces
2. **Functional Components** - Use hooks, avoid class components
3. **Tailwind CSS Only** - No custom CSS files
4. **Accessibility** - Use semantic HTML, add aria labels
5. **Performance** - Use `memo` for expensive components
6. **Reusability** - Accept props for customization

### Component Naming

- One component per file
- Match filename to component name
- Use PascalCase for components
- Use camelCase for utilities

## 🎨 Styling with Tailwind

### Key Principles

- **Utility-first**: Use Tailwind classes, not custom CSS
- **Responsive**: Mobile-first with `sm:`, `lg:` prefixes
- **Dark mode ready**: Use color tokens properly

### Common Patterns

```tsx
// Button
<button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition">
  Click me
</button>

// Card
<div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.1)]">
  Content
</div>

// Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => ...)}
</div>

// Responsive text
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Title
</h1>
```

## 🔐 Authentication

### Using Auth Context

```tsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      {isAdmin && <button>Admin Panel</button>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

Routes automatically protected with `ProtectedRoute` component:
- `/profile` - Requires authentication
- `/bookings` - Requires authentication
- `/admin/*` - Requires admin role

## 📡 API Communication

### Using the API Client

```tsx
import { api, getErrorMessage } from '../lib/api';

async function fetchData() {
  try {
    const response = await api.get('/motorcycles');
    console.log(response.data);
  } catch (error) {
    console.error(getErrorMessage(error));
  }
}
```

### API Endpoints

```
GET    /motorcycles              - List motorcycles
GET    /motorcycles/:id          - Get motorcycle details
POST   /bookings                 - Create booking
GET    /bookings                 - Get user bookings
DELETE /bookings/:id             - Cancel booking
GET    /inquiries                - Get inquiries
POST   /inquiries                - Send inquiry
GET    /auth/me                  - Get current user
PUT    /auth/me                  - Update profile
PUT    /auth/change-password     - Change password
POST   /auth/login               - Login
POST   /auth/register            - Register
POST   /auth/logout              - Logout
```

## 🧁 Toast Notifications

```tsx
import { useToast } from '../context/ToastContext';

function MyComponent() {
  const { addToast } = useToast();
  
  const handleClick = () => {
    try {
      // Do something
      addToast('Success!', 'success', 5000);
    } catch (error) {
      addToast('Error occurred', 'error');
    }
  };
  
  return <button onClick={handleClick}>Action</button>;
}
```

### Toast Types
- `success` - Green, for successful actions
- `error` - Red, for errors
- `warning` - Orange, for warnings
- `info` - Blue, for information

## 🎭 Form Handling

### Using Form Components

```tsx
import { Input, Button, Select } from '../components';
import { useState } from 'react';

function MyForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email required');
      return;
    }
    // Submit form
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        placeholder="you@example.com"
        required
      />
      
      <Select
        label="Category"
        options={[
          { value: 'sport', label: 'Sport Bike' },
          { value: 'cruiser', label: 'Cruiser' },
        ]}
      />
      
      <Button type="submit" variant="primary">
        Submit
      </Button>
    </form>
  );
}
```

## 📊 Creating a New Page

### Page Template

```tsx
// src/pages/MyPage.tsx
import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../lib/api';
import { SkeletonGrid } from '../components/Skeleton';
import { EmptyState, ErrorState } from '../components/ErrorState';

interface PageData {
  items: any[];
}

export function MyPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get('/some-endpoint');
        setData(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetch();
  }, []);
  
  if (loading) return <SkeletonGrid />;
  if (error) return <ErrorState message={error} />;
  if (!data?.items.length) return <EmptyState title="No items" />;
  
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Page</h1>
        <p className="text-slate-600">Description</p>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map(item => (
          <div key={item.id} className="rounded-2xl bg-white p-6 shadow-sm">
            {/* Content */}
          </div>
        ))}
      </div>
    </section>
  );
}
```

## 🧪 Testing Guidelines

### Manual Testing Checklist

- [ ] Mobile responsiveness (320px, 640px, 1024px)
- [ ] Form validation and error messages
- [ ] Loading states display properly
- [ ] Error states display properly
- [ ] Empty states display properly
- [ ] Links and buttons work
- [ ] Keyboard navigation works
- [ ] Toast notifications appear
- [ ] Modals open/close properly
- [ ] Authentication works
- [ ] API calls succeed
- [ ] Data displays correctly

### Browser Testing

Test in:
- Chrome (desktop + mobile)
- Firefox (desktop)
- Safari (desktop + iOS)
- Edge (desktop)

## 🐛 Debugging Tips

### Browser DevTools
1. Open DevTools (F12)
2. Check Console for errors
3. Use Network tab to debug API calls
4. Use Elements tab to inspect DOM
5. Use React DevTools extension

### VS Code Debugging
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5174",
      "webRoot": "${workspaceFolder}",
      "sourceMapPathOverride": {
        "/src/*": "${webRoot}/src/*"
      }
    }
  ]
}
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Hot reload not working | Clear browser cache, restart dev server |
| Tailwind classes not applying | Check class name spelling, restart dev server |
| API not responding | Check API_BASE_URL, verify API server running |
| Type errors | Run `tsc --noEmit` to check all types |
| Component not updating | Check dependencies in useEffect |

## 📚 Code Style & Standards

### TypeScript
- Always define prop types with interfaces
- Use `type` for type-only imports
- Avoid `any` type - use `unknown` and narrow
- Enable strict mode in tsconfig.json

### Naming Conventions
```
- Components: PascalCase (MyComponent)
- Files: PascalCase for components, camelCase for utils
- Functions: camelCase (handleClick)
- Constants: UPPER_SNAKE_CASE (MAX_ITEMS)
- Interfaces: PascalCase with optional I prefix (UserProps)
```

### Import Order
```tsx
// 1. External imports
import React from 'react';
import { useState } from 'react';

// 2. Internal imports - types
import type { User } from '../types';

// 3. Internal imports - components
import { Button } from '../components';

// 4. Internal imports - utils/context
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
```

## 🔗 Useful Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Router Docs](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Contributing Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and test thoroughly
3. Commit with clear messages: `git commit -m "Add feature description"`
4. Push branch: `git push origin feature/my-feature`
5. Create Pull Request with description
6. Code review and merge

## 📞 Getting Help

- Check existing documentation
- Search GitHub issues
- Ask in team chat
- Review similar components for patterns
- Contact: dev@motorcyclehub.com

---

Happy coding! 🎉
