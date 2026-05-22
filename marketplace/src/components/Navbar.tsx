import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
            <Link to="/auth" className="text-brand-pink font-semibold text-sm px-4 py-2 hover:bg-pink-50 rounded-lg transition-colors">
              Entrar
            </Link>
            <Link to="/auth?tab=register"
              className="bg-brand-pink text-white font-semibold text-sm px-5 py-2 rounded-lg hover:bg-brand-pink-dark transition-colors shadow-sm">
              Cadastrar
            </Link>
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
          </div>
        )}
      </div>
    </header>
  );
}
