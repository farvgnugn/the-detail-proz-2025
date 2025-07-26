export interface AdminUser {
  id: string;
  email: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessSettings {
  id: string;
  phoneNumber: string;
  phoneFormatted: string;
  phoneLink: string;
  updatedAt: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: string;
  popular: boolean;
  interior: string[];
  exterior: string[];
  order: number;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  category: 'before' | 'after' | 'process';
  order: number;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  token: string | null;
}