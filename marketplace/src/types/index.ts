export type UserRole = 'buyer' | 'seller' | 'both';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rating?: number;
  reviews?: number;
  location?: string;
  joinedAt: string;
}

export type OrderStatus = 'active' | 'closed';

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  product: string;
  brand: string;
  characteristics: string;
  desiredPrice: number;
  description: string;
  category: string;
  tags: string[];
  photos: string[];
  status: OrderStatus;
  createdAt: string;
  offerCount: number;
}

export interface Offer {
  id: string;
  orderId: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerReviews: number;
  sellerVerified: boolean;
  sellerLocation: string;
  price: number;
  deliveryDays: number;
  message: string;
  photos: string[];
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Rating {
  id: string;
  offerId: string;
  orderId: string;
  raterId: string;
  raterName: string;
  rateeId: string;
  rateeName: string;
  raterRole: 'buyer' | 'seller';
  score: number;
  comment: string;
  createdAt: string;
}

export interface Negotiation {
  id: string;
  offerId: string;
  orderId: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  counterPrice?: number;
  message: string;
  createdAt: string;
}
