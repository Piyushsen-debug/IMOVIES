export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  watchlist?: string[]; // movie IDs
  memberSince?: string;
  loyaltyTier?: 'Silver' | 'Gold' | 'District Black';
  rewardPoints?: number;
}

export interface MovieReview {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  headline: string;
  content: string;
  isVerifiedBooking: boolean;
  likes: number;
  likedBy?: string[];
  createdAt: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface CastMember {
  actorName: string;
  roleName: string;
  imageUrl?: string;
}

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  description: string;
  genre: string[];
  language: string[];
  formats: string[]; // e.g. ['IMAX 3D', '4DX', 'Dolby Atmos', '2D']
  duration: number; // in minutes
  censorRating: 'U' | 'U/A 13+' | 'U/A 16+' | 'A';
  releaseDate: string;
  rating: number; // 0 - 5
  votes: number;
  posterUrl: string;
  bannerUrl: string;
  trailerUrl: string;
  cast: CastMember[];
  director: string;
  featured?: boolean;
}

export interface Screen {
  screenNumber: number;
  name: string;
  format: string;
  totalSeats: number;
}

export interface Theatre {
  id: string;
  name: string;
  chain: string; // 'PVR INOX' | 'Cinepolis' | 'Miraj' | 'MovieMax'
  city: string;
  location: {
    address: string;
    area: string;
  };
  amenities: string[]; // 'M-Ticket' | 'Food & Beverage' | 'Recliner' | 'Dolby Atmos' | 'Wheelchair'
  screens: Screen[];
}

export interface Show {
  id: string;
  movieId: string;
  theaterId: string;
  theater: Theatre;
  screenNumber: number;
  screenFormat: string;
  showDate: string; // YYYY-MM-DD
  showTime: string; // e.g. "07:15 PM"
  pricing: {
    silver: number;
    gold: number;
    platinum: number;
  };
  occupancyStatus: 'AVAILABLE' | 'FILLING_FAST' | 'ALMOST_FULL';
}

export type SeatCategory = 'Platinum' | 'Gold' | 'Silver';
export type SeatStatus = 'AVAILABLE' | 'LOCKED' | 'BOOKED';

export interface Seat {
  seatNumber: string;
  row: string;
  col: number;
  category: SeatCategory;
  status: SeatStatus;
  price: number;
  lockedBy?: string | null;
  lockExpiresAt?: string | null;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'Popcorn' | 'Combos' | 'Bites' | 'Beverages';
  price: number;
  description: string;
  isVeg: boolean;
  calories?: string;
  imageUrl: string;
}

export interface SnackOrderItem {
  item: FoodItem;
  quantity: number;
}

export interface Booking {
  id: string;
  bookingId: string; // e.g. 'IMOV-48291X'
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  show: Show;
  movie: Movie;
  seats: string[];
  seatDetails: { seatNumber: string; category: SeatCategory; price: number }[];
  snacks: SnackOrderItem[];
  ticketSubtotal: number;
  convenienceFee: number;
  snacksSubtotal: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  bookingStatus: 'CONFIRMED' | 'CANCELLED';
  paymentMethod: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING';
  transactionId: string;
  qrCodeDataUrl: string;
  createdAt: string;
}

export interface AdminMetrics {
  totalRevenue: number;
  ticketsSold: number;
  activeShows: number;
  occupancyRate: number;
}
