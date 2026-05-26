import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Logo from './Logo';
import {
  Home, ShoppingBag, PlusCircle, Package,
  Bell, Heart, MessageSquare, LogOut,
  Menu, ChevronDown, Store, User as UserIcon,
} from 'lucide-react';

const NAV = [
  { label: 'Início', icon: <Home size={18} />, path: '/', roles: ['buyer', 'seller', 'both'] },
  { label: 'Meus Pedidos', icon: <ShoppingBag size={18} />, path: '/buyer/orders', roles: ['buyer', 'both'] },
  { label: 'Criar Pedido', icon: <PlusCircle size={18} />, path: '/buyer/orders/create', roles: ['buyer', 'both'] },
  { label: 'Ver Pedidos', icon: <Package size={18} />, path: '/seller/orders', roles: ['seller', 'both'] },
  { label: 'Minhas Ofertas', icon: <MessageSquare size={18} />, path: '/seller/my-offers', roles: ['seller', 'both'] },
] as const;

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const items = NAV.filter(n => !user || (n.roles as readonly string[]).includes(user.role));
  const active = (p: string) => location.pathname === p;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 h-16">
        <div className="flex items-center h-full px-4 gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <Menu size={20} />
          </button>
          <Link to="/" className="flex-shrink-0"><Logo size="sm" /></Link>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button className="p-2 text-gray-500 hover:text-brand-pink hover:bg-pink-50 rounded-lg transition-colors">
              <Bell size={19} />
            </button>
            <button className="hidden sm:flex p-2 text-gray-500 hover:text-brand-pink hover:bg-pink-50 rounded-lg transition-colors">
              <Heart size={19} />
            </button>
            <button className="hidden sm:flex p-2 text-gray-500 hover:text-brand-pink hover:bg-pink-50 rounded-lg transition-colors">
              <MessageSquare size={19} />
            </button>

            <div className="relative ml-1">
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-pink to-brand-pink-light flex items-center justify-center text-white font-bold text-sm">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-gray-700 max-w-[96px] truncate">{user?.name}</span>
                <ChevronDown size={13} className="hidden sm:block text-gray-400" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-blue-50">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    <span className="mt-1 inline-block text-xs font-medium text-brand-pink bg-pink-100 px-2 py-0.5 rounded-full">
                      {user?.role === 'buyer' ? 'Comprador' : user?.role === 'seller' ? 'Vendedor' : 'Comprador & Vendedor'}
                    </span>
                  </div>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={15} /> Sair da conta
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-30
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <nav className="p-3 space-y-0.5 mt-2">
          {items.map(item => (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${active(item.path)
                  ? 'bg-gradient-to-r from-pink-50 to-pink-100 text-brand-pink shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <span className={active(item.path) ? 'text-brand-pink' : 'text-gray-400'}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-3 right-3">
          <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl p-3 border border-pink-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-pink to-brand-blue flex items-center justify-center">
                {user?.role === 'seller' ? <Store size={16} className="text-white" /> : <UserIcon size={16} className="text-white" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {user?.role === 'buyer' ? 'Comprador' : user?.role === 'seller' ? 'Vendedor' : 'Comprador & Vendedor'}
                </p>
                {user?.rating ? (
                  <p className="text-xs text-gray-500">⭐ {user.rating} · {user.reviews} avaliações</p>
                ) : (
                  <p className="text-xs text-gray-500">Conta nova</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-64 mt-16 flex-1 pb-20 lg:pb-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-20 safe-area-bottom">
        <div className="flex">
          {items.slice(0, 4).map(item => (
            <Link key={item.path} to={item.path}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors
                ${active(item.path) ? 'text-brand-pink' : 'text-gray-400'}`}>
              {item.icon}
              <span className="text-center px-0.5" style={{ fontSize: '9px', lineHeight: '12px' }}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
