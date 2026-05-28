import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, ShoppingBag, Package } from 'lucide-react';
import Logo from './Logo';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); setOpen(false); };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <nav className="hidden md:flex items-center gap-8">
            {['Como funciona', 'Para quem vende', 'Categorias', 'Segurança', 'Sobre nós'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/ /g, '-')}`}
                className="text-gray-600 hover:text-brand-pink text-sm font-medium transition-colors">
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-pink to-brand-pink-light flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 max-w-[96px] truncate">{user.name}</span>
                  <ChevronDown size={13} className="text-gray-400" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-blue-50">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <span className="mt-1 inline-block text-xs font-medium text-brand-pink bg-pink-100 px-2 py-0.5 rounded-full">
                        {user.role === 'buyer' ? 'Comprador' : user.role === 'seller' ? 'Vendedor' : 'Comprador & Vendedor'}
                      </span>
                    </div>
                    {(user.role === 'buyer' || user.role === 'both') && (
                      <Link to="/buyer/orders" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <ShoppingBag size={15} /> Meus Pedidos
                      </Link>
                    )}
                    {(user.role === 'seller' || user.role === 'both') && (
                      <Link to="/seller/orders" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Package size={15} /> Ver Pedidos
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">
                      <LogOut size={15} /> Sair da conta
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/auth" className="text-brand-pink font-semibold text-sm px-4 py-2 hover:bg-pink-50 rounded-lg transition-colors">
                  Entrar
                </Link>
                <Link to="/auth?tab=register"
                  className="bg-brand-pink text-white font-semibold text-sm px-5 py-2 rounded-lg hover:bg-brand-pink-dark transition-colors shadow-sm">
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-1 pb-4">
            {['Como funciona', 'Para quem vende', 'Segurança'].map(label => (
              <a key={label} href="#" onClick={() => setOpen(false)}
                className="block px-4 py-2 text-gray-600 hover:text-brand-pink text-sm rounded-lg">
                {label}
              </a>
            ))}
            {user ? (
              <div className="pt-3 px-4 space-y-2">
                <div className="flex items-center gap-2 py-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-pink to-brand-pink-light flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role === 'buyer' ? 'Comprador' : user.role === 'seller' ? 'Vendedor' : 'Comprador & Vendedor'}</p>
                  </div>
                </div>
                {(user.role === 'buyer' || user.role === 'both') && (
                  <Link to="/buyer/orders" onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 bg-gray-50 rounded-lg">
                    <ShoppingBag size={15} /> Meus Pedidos
                  </Link>
                )}
                {(user.role === 'seller' || user.role === 'both') && (
                  <Link to="/seller/orders" onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 bg-gray-50 rounded-lg">
                    <Package size={15} /> Ver Pedidos
                  </Link>
                )}
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 bg-red-50 rounded-lg">
                  <LogOut size={15} /> Sair da conta
                </button>
              </div>
            ) : (
              <div className="pt-3 flex gap-3 px-4">
                <Link to="/auth" onClick={() => setOpen(false)}
                  className="flex-1 text-center text-brand-pink font-semibold text-sm py-2.5 border-2 border-brand-pink rounded-lg">
                  Entrar
                </Link>
                <Link to="/auth?tab=register" onClick={() => setOpen(false)}
                  className="flex-1 text-center bg-brand-pink text-white font-semibold text-sm py-2.5 rounded-lg">
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
