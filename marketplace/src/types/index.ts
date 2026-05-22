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
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}
