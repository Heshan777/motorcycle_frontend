# Motorcycle Frontend

Frontend for the `motorcycle_backend` API (`/api/v1`) with:

- Public motorcycle catalog and details
- Public inquiry and test-ride booking forms
- User auth (register/login), profile update, password change
- User bookings management
- Admin dashboard (stats, users, inquiries, bookings)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Set backend URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_STORAGE_BUCKET=motorcycle-images
```

4. In Supabase Storage, create the `motorcycle-images` bucket and make it public.

5. Start dev server:

```bash
npm run dev
```

6. Production build:

```bash
npm run build
```
