export type AppScreen = 
  | 'install_wall'
  | 'splash'
  | 'choose_experience'
  | 'customer_login'
  | 'provider_login'
  | 'customer_register'
  | 'provider_register'
  | 'home'
  | 'service_details'
  | 'request_sheet'
  | 'searching'
  | 'provider_accepted'
  | 'live_tracking'
  | 'chat'
  | 'job_completed'
  | 'customer_profile'
  | 'provider_dashboard'
  | 'provider_jobs'
  | 'provider_messages'
  | 'provider_profile'
  | 'requests_history'
  | 'messages_list';

export type UserRole = 'customer' | 'provider' | 'guest';

export interface SavedLocation {
  id: string;
  label: string;
  address: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  address: string;
  avatarUrl: string;
  role: UserRole;
  savedLocations?: SavedLocation[];
  notificationsEnabled?: boolean;
  themeMode?: 'light' | 'dark' | 'system';
}

export interface SubService {
  id: string;
  name: string;
  description: string;
  price: number;
  currencySymbol?: string;
  estimatedDuration: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  illustrationKey: 'electrical' | 'plumbing' | 'maintenance' | 'cleaning' | 'mechanic' | 'beauty' | 'technical' | 'nanny' | 'errands';
  priceStarting: number;
  estimatedDuration: string;
  popularServices: string[];
  description: string;
  subServices?: SubService[];
}

export interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  avatarUrl: string;
  distanceKm: number;
  estimatedArrivalMins: number;
  hourlyRate: number;
  verified: boolean;
  phone: string;
  completedJobs: number;
  location: {
    lat: number;
    lng: number;
  };
  bio: string;
  specialties: string[];
  vehicle: string;
}

export interface ServiceBookingRequest {
  id: string;
  categoryId: string;
  categoryTitle: string;
  subServiceTitle?: string;
  providerId?: string;
  provider?: ServiceProvider;
  customerName: string;
  address: string;
  notes: string;
  paymentMethod: 'paystack_card' | 'paystack_eft' | 'paystack_mobile' | 'apple_pay' | 'credit_card' | 'cash';
  amount: number;
  status: 'pending' | 'searching' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  scheduledTime?: string;
  userCoords: { lat: number; lng: number };
  providerCoords: { lat: number; lng: number };
  ratingGiven?: number;
  reviewGiven?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  status: 'sent' | 'delivered' | 'read';
}
