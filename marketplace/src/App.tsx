import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Payment from './pages/Payment';
import MyOrders from './pages/buyer/MyOrders';
import CreateOrder from './pages/buyer/CreateOrder';
import OrderOffers from './pages/buyer/OrderOffers';
import RateSeller from './pages/buyer/RateSeller';
import BrowseOrders from './pages/seller/BrowseOrders';
import OrderDetail from './pages/seller/OrderDetail';
import MyOffers from './pages/seller/MyOffers';
import SellerProfile from './pages/seller/SellerProfile';
import RateBuyer from './pages/seller/RateBuyer';
import { ReactNode } from 'react';

function Guard({ children, role }: { children: ReactNode; role?: 'buyer' | 'seller' }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/auth" replace />;
  if (role && user.role !== role && user.role !== 'both') return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/buyer/orders" element={<Guard role="buyer"><MyOrders /></Guard>} />
      <Route path="/buyer/orders/create" element={<Guard role="buyer"><CreateOrder /></Guard>} />
      <Route path="/buyer/orders/:id/offers" element={<Guard role="buyer"><OrderOffers /></Guard>} />
      <Route path="/buyer/rate/:offerId" element={<Guard role="buyer"><RateSeller /></Guard>} />
      <Route path="/payment/:orderId" element={<Guard role="buyer"><Payment /></Guard>} />
      <Route path="/seller/orders" element={<Guard role="seller"><BrowseOrders /></Guard>} />
      <Route path="/seller/orders/:id" element={<Guard role="seller"><OrderDetail /></Guard>} />
      <Route path="/seller/my-offers" element={<Guard role="seller"><MyOffers /></Guard>} />
      <Route path="/seller/rate/:offerId" element={<Guard role="seller"><RateBuyer /></Guard>} />
      <Route path="/seller/profile/:sellerId" element={<Guard><SellerProfile /></Guard>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
