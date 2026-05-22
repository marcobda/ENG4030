import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';
import { UserRole } from '../types';
import { Eye, EyeOff, ShoppingBag, Store, Users, ArrowLeft } from 'lucide-react';

export default function Auth() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState<'login' | 'register'>(params.get('tab') === 'register' ? 'register' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, register, user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'seller' ? '/seller/orders' : '/buyer/orders');
    }
  }, [user, navigate]);

  useEffect(() => {
    setError('');
  }, [tab, email, password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (tab === 'login') {
      if (!login(email, password)) {
        setError('E-mail ou senha incorretos. Use as contas demo abaixo.');
      }
    } else {
      if (!name.trim()) { setError('Informe seu nome.'); return; }
      if (!email.includes('@')) { setError('Informe um e-mail válido.'); return; }
      if (password.length < 6) { setError('A senha deve ter ao menos 6 caracteres.'); return; }
      register(name, email, password, role);
    }
  };

  const ROLES: { value: UserRole; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      value: 'buyer',
      label: 'Comprador',
      desc: 'Publicar pedidos e receber ofertas de vendedores',
      icon: <ShoppingBag size={22} />,
      color: 'brand-pink',
    },
    {
      value: 'seller',
      label: 'Vendedor',
      desc: 'Ver pedidos e enviar propostas de venda',
      icon: <Store size={22} />,
      color: 'brand-blue',
    },
    {
      value: 'both',
      label: 'Ambos',
      desc: 'Comprar e vender na mesma plataforma',
      icon: <Users size={22} />,
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium">
          <ArrowLeft size={16} /> Voltar
        </Link>
        <Logo size="sm" />
        <div className="w-16" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                  tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {t === 'login' ? 'Entrar' : 'Cadastrar'}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
              {tab === 'login' ? 'Bem-vindo de volta!' : 'Criar conta grátis'}
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              {tab === 'login'
                ? 'Entre para acessar pedidos e ofertas'
                : 'Comece a usar o marketplace invertido'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome completo</label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-pink focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-pink focus:ring-2 focus:ring-pink-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:border-brand-pink focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {tab === 'register' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quero usar como...
                  </label>
                  <div className="space-y-2.5">
                    {ROLES.map(r => (
                      <label key={r.value}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                          role === r.value
                            ? r.value === 'buyer' ? 'border-brand-pink bg-pink-50'
                              : r.value === 'seller' ? 'border-brand-blue bg-blue-50'
                              : 'border-purple-400 bg-purple-50'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}>
                        <input type="radio" name="role" value={r.value} checked={role === r.value}
                          onChange={() => setRole(r.value)} className="sr-only" />
                        <span className={`mt-0.5 ${
                          role === r.value
                            ? r.value === 'buyer' ? 'text-brand-pink'
                              : r.value === 'seller' ? 'text-brand-blue'
                              : 'text-purple-500'
                            : 'text-gray-400'
                        }`}>
                          {r.icon}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{r.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button type="submit"
                className="w-full bg-brand-pink text-white font-bold py-3.5 rounded-xl hover:bg-brand-pink-dark transition-all shadow-sm shadow-pink-200 text-sm mt-2">
                {tab === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            </form>

            {tab === 'login' && (
              <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-blue-800 mb-2">🔑 Contas demo:</p>
                <div className="space-y-1">
                  {[
                    { email: 'comprador@demo.com', label: 'Comprador' },
                    { email: 'vendedor@demo.com', label: 'Vendedor' },
                    { email: 'ambos@demo.com', label: 'Ambos' },
                  ].map(d => (
                    <button key={d.email} onClick={() => { setEmail(d.email); setPassword('demo123'); }}
                      className="w-full text-left text-xs text-blue-700 hover:text-blue-900 hover:underline">
                      {d.label}: {d.email} / demo123
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
