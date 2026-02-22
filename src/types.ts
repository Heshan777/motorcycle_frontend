export type UserRole = 'user' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export type MotorcycleCategory =
  | 'sport'
  | 'cruiser'
  | 'adventure'
  | 'scooter'
  | 'electric'
  | 'commuter';

export type MotorcycleStatus = 'available' | 'upcoming' | 'discontinued';

export interface Motorcycle {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  category: MotorcycleCategory;
  price: number;
  engine: string;
  horsepower: number;
  torque: number;
  topSpeed: number;
  mileage: number;
  stock: number;
  status: MotorcycleStatus;
  isFeatured: boolean;
  description: string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  _id: string;
  user: Pick<User, '_id' | 'name' | 'email'> | null;
  motorcycle: Pick<Motorcycle, '_id' | 'name' | 'slug' | 'brand' | 'category'>;
  name: string;
  email: string;
  phone: string;
  city: string;
  preferredDate: string;
  notes?: string;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type InquiryStatus = 'new' | 'in-progress' | 'closed';

export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  motorcycle: Pick<Motorcycle, '_id' | 'name' | 'slug' | 'brand' | 'category'> | null;
  status: InquiryStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiError {
  success?: false;
  message: string;
}

export interface Feedback {
  _id?: string;
  author: string;
  email: string;
  authorImageUrl?: string;
  rating: number;
  text: string;
  motorcycle?: Pick<Motorcycle, '_id' | 'name' | 'slug' | 'brand'> | null;
  avatarEmoji?: string;
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
