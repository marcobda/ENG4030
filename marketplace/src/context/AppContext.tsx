import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Order, Offer, UserRole, Rating, Message } from '../types';
import { extractTags } from '../utils/extractTags';

export const SERVICE_FEE_RATE = 0.03;

export const CATEGORIES = [
  'Todos',
  'Tênis & Calçados',
  'Bolsas de Luxo',
  'Relógios de Luxo',
  'Eletrônicos',
  'Roupas & Moda',
  'Instrumentos Musicais',
  'Arte & Colecionáveis',
  'Acessórios',
  'Esportes',
  'Outros',
];

function mockOrder(o: Omit<Order, 'tags' | 'photos'>): Order {
  return { ...o, photos: [], tags: extractTags(o.product, o.brand, o.characteristics, o.description) };
}

const MOCK_ORDERS: Order[] = [
  mockOrder({
    id: 'o1', buyerId: 'u_buyer', buyerName: 'Carlos Silva',
    product: 'Tênis Air Jordan 1 Retro High OG',
    brand: 'Nike',
    characteristics: 'Tamanho 42, cor Chicago, novo ou seminovo, edição limitada',
    desiredPrice: 1200,
    description: 'Procuro o Jordan 1 Chicago original, aceito seminovo em ótimo estado com caixa.',
    category: 'Tênis & Calçados',
    status: 'active', createdAt: '2026-05-20T10:00:00Z', offerCount: 3,
  }),
  mockOrder({
    id: 'o2', buyerId: 'u_buyer', buyerName: 'Carlos Silva',
    product: 'Relógio Rolex Submariner Date',
    brand: 'Rolex',
    characteristics: 'Mostrador preto, pulseira de aço, caixa 41mm, ref 126610LN',
    desiredPrice: 85000,
    description: 'Busco Submariner em perfeito estado, preferência de 2020 em diante com papéis.',
    category: 'Relógios de Luxo',
    status: 'active', createdAt: '2026-05-18T14:30:00Z', offerCount: 1,
  }),
  mockOrder({
    id: 'o3', buyerId: 'u2', buyerName: 'Ana Rodrigues',
    product: 'Bolsa Louis Vuitton Neverfull MM',
    brand: 'Louis Vuitton',
    characteristics: 'Canvas monograma, interior rose ballerine ou cerise, com pouch',
    desiredPrice: 8500,
    description: 'Quero a Neverfull MM original com todos os acessórios e, se possível, nota fiscal.',
    category: 'Bolsas de Luxo',
    status: 'active', createdAt: '2026-05-17T09:15:00Z', offerCount: 5,
  }),
  mockOrder({
    id: 'o4', buyerId: 'u2', buyerName: 'Ana Rodrigues',
    product: 'iPhone 15 Pro Max 256GB',
    brand: 'Apple',
    characteristics: 'Titânio natural, novo ou até 3 meses de uso, com nota fiscal e caixa',
    desiredPrice: 6500,
    description: 'Preciso com nota fiscal e caixa original. Não aceito aparelho com histórico de reparo.',
    category: 'Eletrônicos',
    status: 'active', createdAt: '2026-05-16T16:00:00Z', offerCount: 8,
  }),
  mockOrder({
    id: 'o5', buyerId: 'u3', buyerName: 'Pedro Mendes',
    product: 'MacBook Pro M3 Pro 14"',
    brand: 'Apple',
    characteristics: '18GB RAM, 512GB SSD, Space Gray ou Space Black',
    desiredPrice: 14000,
    description: 'Aceito seminovo com no máximo 6 meses de uso, bateria acima de 90%.',
    category: 'Eletrônicos',
    status: 'active', createdAt: '2026-05-15T11:45:00Z', offerCount: 2,
  }),
  mockOrder({
    id: 'o6', buyerId: 'u3', buyerName: 'Pedro Mendes',
    product: 'Guitarra Fender Stratocaster Am. Professional II',
    brand: 'Fender',
    characteristics: 'Corpo alder, braço maple, cor Olympic White ou 3-Color Sunburst',
    desiredPrice: 9000,
    description: 'Seminova em excelente estado, com case original e certificado de autenticidade.',
    category: 'Instrumentos Musicais',
    status: 'active', createdAt: '2026-05-14T08:30:00Z', offerCount: 0,
  }),
  mockOrder({
    id: 'o7', buyerId: 'u4', buyerName: 'Fernanda Lima',
    product: 'Bolsa Hermès Birkin 30',
    brand: 'Hermès',
    characteristics: 'Togo ou Epsom, cor Étain ou Gold, ferragens douradas ou palladium',
    desiredPrice: 120000,
    description: 'Peça rara, aceito com ou sem recibo original. Farei autenticação.',
    category: 'Bolsas de Luxo',
    status: 'active', createdAt: '2026-05-13T10:00:00Z', offerCount: 2,
  }),
  mockOrder({
    id: 'o8', buyerId: 'u4', buyerName: 'Fernanda Lima',
    product: 'Tênis Nike Dunk Low Panda',
    brand: 'Nike',
    characteristics: 'Tamanho 37 feminino, cor preto e branco, novo na caixa',
    desiredPrice: 800,
    description: 'Preciso novo, na caixa, sem uso.',
    category: 'Tênis & Calçados',
    status: 'active', createdAt: '2026-05-12T15:30:00Z', offerCount: 4,
  }),
];

const MOCK_OFFERS: Offer[] = [
  {
    id: 'f1', orderId: 'o1',
    sellerId: 'u_seller', sellerName: 'TopStyle',
    sellerRating: 5.0, sellerReviews: 512, sellerVerified: true, sellerLocation: 'SP',
    price: 1050, deliveryDays: 3,
    message: 'Tenho em estoque, condição impecável, comprado direto da Nike.',
    photos: [], createdAt: '2026-05-21T10:00:00Z', status: 'pending',
  },
  {
    id: 'f2', orderId: 'o1',
    sellerId: 'u2s', sellerName: 'Sneaker House',
    sellerRating: 4.9, sellerReviews: 237, sellerVerified: true, sellerLocation: 'RJ',
    price: 1100, deliveryDays: 4,
    message: 'Produto novo na caixa, com nota fiscal.',
    photos: [], createdAt: '2026-05-21T11:00:00Z', status: 'pending',
  },
  {
    id: 'f3', orderId: 'o1',
    sellerId: 'u3s', sellerName: 'Urban Kicks',
    sellerRating: 4.8, sellerReviews: 163, sellerVerified: true, sellerLocation: 'MG',
    price: 1150, deliveryDays: 5,
    message: 'Seminovo, usado apenas 2x, conservadíssimo.',
    photos: [], createdAt: '2026-05-21T12:00:00Z', status: 'pending',
  },
];

interface AuthUser extends User { password: string; }
const DEMO_USERS: AuthUser[] = [
  { id: 'u_buyer', name: 'Carlos Silva', email: 'comprador@demo.com', password: 'demo123', role: 'buyer', rating: 4.8, reviews: 23, location: 'SP', joinedAt: '2025-01-15T00:00:00Z' },
  { id: 'u_seller', name: 'TopStyle Store', email: 'vendedor@demo.com', password: 'demo123', role: 'seller', rating: 5.0, reviews: 512, location: 'SP', joinedAt: '2024-06-01T00:00:00Z' },
  { id: 'u_both', name: 'Maria Costa', email: 'ambos@demo.com', password: 'demo123', role: 'both', rating: 4.7, reviews: 45, location: 'RJ', joinedAt: '2025-03-20T00:00:00Z' },
];

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: UserRole) => void;
  logout: () => void;
  orders: Order[];
  offers: Offer[];
  ratings: Rating[];
  messages: Message[];
  categories: string[];
  createOrder: (data: Omit<Order, 'id' | 'buyerId' | 'buyerName' | 'createdAt' | 'offerCount' | 'status' | 'tags'>) => void;
  submitOffer: (data: Omit<Offer, 'id' | 'createdAt' | 'status'>) => void;
  acceptOffer: (offerId: string, orderId: string) => void;
  submitRating: (data: Omit<Rating, 'id' | 'createdAt'>) => void;
  sendMessage: (data: Omit<Message, 'id' | 'createdAt'>) => void;
  hasRated: (offerId: string, raterRole: 'buyer' | 'seller') => boolean;
  getRatingsForSeller: (sellerId: string) => Rating[];
  getChannelMessages: (offerId: string) => Message[];
  acceptCounterPrice: (offerId: string, newPrice: number) => void;
  getAcceptedOffer: (orderId: string) => Offer | undefined;
  getOrderOffers: (orderId: string) => Offer[];
  getMyOrders: () => Order[];
  getMyOffers: () => Offer[];
  getSellerOffers: (sellerId: string) => Offer[];
  hasOfferedOnOrder: (orderId: string) => boolean;
}

const Ctx = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem('mc_user') || 'null'); } catch { return null; }
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    try { return JSON.parse(localStorage.getItem('mc_orders') || 'null') || MOCK_ORDERS; } catch { return MOCK_ORDERS; }
  });
  const [offers, setOffers] = useState<Offer[]>(() => {
    try { return JSON.parse(localStorage.getItem('mc_offers') || 'null') || MOCK_OFFERS; } catch { return MOCK_OFFERS; }
  });
  const [ratings, setRatings] = useState<Rating[]>(() => {
    try { return JSON.parse(localStorage.getItem('mc_ratings') || '[]'); } catch { return []; }
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    try { return JSON.parse(localStorage.getItem('mc_messages') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    user ? localStorage.setItem('mc_user', JSON.stringify(user)) : localStorage.removeItem('mc_user');
  }, [user]);
  useEffect(() => { localStorage.setItem('mc_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('mc_offers', JSON.stringify(offers)); }, [offers]);
  useEffect(() => { localStorage.setItem('mc_ratings', JSON.stringify(ratings)); }, [ratings]);
  useEffect(() => { localStorage.setItem('mc_messages', JSON.stringify(messages)); }, [messages]);

  const login = (email: string, password: string): boolean => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _pw, ...u } = found;
      void _pw;
      setUser(u);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, _pw: string, role: UserRole) => {
    setUser({ id: `u_${Date.now()}`, name, email, role, joinedAt: new Date().toISOString() });
  };

  const logout = () => setUser(null);

  const createOrder = (data: Omit<Order, 'id' | 'buyerId' | 'buyerName' | 'createdAt' | 'offerCount' | 'status' | 'tags'>) => {
    if (!user) return;
    const tags = extractTags(data.product, data.brand, data.characteristics, data.description);
    setOrders(prev => [{ ...data, tags, id: `o_${Date.now()}`, buyerId: user.id, buyerName: user.name, createdAt: new Date().toISOString(), offerCount: 0, status: 'active' }, ...prev]);
  };

  const submitOffer = (data: Omit<Offer, 'id' | 'createdAt' | 'status'>) => {
    setOffers(prev => [...prev, { ...data, id: `f_${Date.now()}`, createdAt: new Date().toISOString(), status: 'pending' }]);
    setOrders(prev => prev.map(o => o.id === data.orderId ? { ...o, offerCount: o.offerCount + 1 } : o));
  };

  const acceptOffer = (offerId: string, orderId: string) => {
    setOffers(prev => prev.map(o => ({
      ...o,
      status: o.orderId === orderId ? (o.id === offerId ? 'accepted' : 'rejected') : o.status,
    })));
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'closed' } : o));
  };

  const getOrderOffers = (orderId: string) =>
    offers.filter(o => o.orderId === orderId).sort((a, b) => a.price - b.price);

  const getMyOrders = () =>
    user ? orders.filter(o => o.buyerId === user.id) : [];

  const getMyOffers = () =>
    user ? offers.filter(o => o.sellerId === user.id) : [];

  const getSellerOffers = (sellerId: string) =>
    offers.filter(o => o.sellerId === sellerId);

  const hasOfferedOnOrder = (orderId: string) =>
    user ? offers.some(o => o.orderId === orderId && o.sellerId === user.id) : false;

  const submitRating = (data: Omit<Rating, 'id' | 'createdAt'>) => {
    setRatings(prev => [...prev, { ...data, id: `r_${Date.now()}`, createdAt: new Date().toISOString() }]);
  };

  const sendMessage = (data: Omit<Message, 'id' | 'createdAt'>) => {
    setMessages(prev => [...prev, { ...data, id: `m_${Date.now()}`, createdAt: new Date().toISOString() }]);
    if (data.senderRole === 'seller' && data.counterPrice !== undefined) {
      setOffers(prev => prev.map(o => o.id === data.offerId ? { ...o, price: data.counterPrice! } : o));
    }
  };

  const acceptCounterPrice = (offerId: string, newPrice: number) => {
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, price: newPrice } : o));
  };

  const hasRated = (offerId: string, raterRole: 'buyer' | 'seller') =>
    user ? ratings.some(r => r.offerId === offerId && r.raterId === user.id && r.raterRole === raterRole) : false;

  const getRatingsForSeller = (sellerId: string) =>
    ratings.filter(r => r.rateeId === sellerId && r.raterRole === 'buyer');

  const getChannelMessages = (offerId: string) =>
    messages.filter(m => m.offerId === offerId).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const getAcceptedOffer = (orderId: string) =>
    offers.find(o => o.orderId === orderId && o.status === 'accepted');

  return (
    <Ctx.Provider value={{
      user, login, register, logout,
      orders, offers, ratings, messages, categories: CATEGORIES,
      createOrder, submitOffer, acceptOffer,
      submitRating, sendMessage, hasRated, getRatingsForSeller,
      getChannelMessages, acceptCounterPrice, getAcceptedOffer,
      getOrderOffers, getMyOrders, getMyOffers, getSellerOffers, hasOfferedOnOrder,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp outside AppProvider');
  return ctx;
};
