import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  MessageSquare, Users, CheckCircle, ShieldCheck,
  Tag, ArrowRight, Star, RefreshCw, Zap,
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 text-brand-pink text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <RefreshCw size={14} /> O marketplace invertido
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 mb-4">
              Diga o que você quer,
              <br />
              <span className="text-brand-pink">receba ofertas</span>
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-lg">
              Você pede a peça rara que procura e vendedores especializados enviam as melhores ofertas para você escolher.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth?tab=register"
                className="inline-flex items-center justify-center gap-2 bg-brand-pink text-white font-bold px-8 py-4 rounded-2xl hover:bg-brand-pink-dark transition-all shadow-lg shadow-pink-200 text-base">
                <MessageSquare size={20} /> Pedir agora <ArrowRight size={18} />
              </Link>
              <Link to="/auth"
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 font-bold px-8 py-4 rounded-2xl hover:border-brand-pink hover:text-brand-pink transition-all text-base">
                Ver pedidos <ArrowRight size={18} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              {[
                { icon: <Tag size={16} />, text: 'Mais ofertas, melhores preços' },
                { icon: <ShieldCheck size={16} />, text: 'Negocie com segurança' },
                { icon: <CheckCircle size={16} />, text: 'Você escolhe a melhor opção' },
              ].map(f => (
                <div key={f.text} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <span className="text-brand-pink">{f.icon}</span> {f.text}
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              {/* Phone mockup */}
              <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 w-72 p-5 rotate-2">
                <div className="bg-gray-100 rounded-2xl p-4 mb-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Novo pedido</p>
                  <p className="text-sm font-bold text-gray-900">Tênis Air Jordan 1 Retro</p>
                  <p className="text-xs text-gray-500">Tamanho 42 · Novo ou seminovo</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-brand-pink font-bold text-sm">até R$ 1.200</span>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">3 ofertas</span>
                  </div>
                </div>
                {[
                  { name: 'TopStyle', price: '1.050', stars: '5.0', tag: 'Melhor preço' },
                  { name: 'Sneaker House', price: '1.100', stars: '4.9', tag: null },
                  { name: 'Urban Kicks', price: '1.150', stars: '4.8', tag: null },
                ].map(offer => (
                  <div key={offer.name} className={`flex items-center justify-between p-2.5 rounded-xl mb-2 border ${
                    offer.tag ? 'border-brand-pink bg-pink-50' : 'border-gray-100 bg-gray-50'
                  }`}>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{offer.name}</p>
                      <div className="flex items-center gap-1">
                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-500">{offer.stars}</span>
                        {offer.tag && <span className="text-xs font-semibold text-brand-pink">· {offer.tag}</span>}
                      </div>
                    </div>
                    <span className="font-bold text-sm text-gray-900">R$ {offer.price}</span>
                  </div>
                ))}
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-brand-blue text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg -rotate-3">
                12 vendedores online
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Como funciona</h2>
            <p className="text-gray-500 text-lg">Simples, rápido e seguro</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <MessageSquare size={28} />,
                step: '01',
                title: 'Você pede',
                desc: 'Descreva o produto que procura: marca, modelo, condição e o preço desejado.',
                color: 'brand-pink',
              },
              {
                icon: <Users size={28} />,
                step: '02',
                title: 'Vendedores oferecem',
                desc: 'Vendedores interessados analisam seu pedido e enviam propostas personalizadas.',
                color: 'brand-blue',
              },
              {
                icon: <CheckCircle size={28} />,
                step: '03',
                title: 'Você escolhe',
                desc: 'Compare ofertas por preço, prazo e avaliações do vendedor. Aceite a melhor.',
                color: 'brand-pink',
              },
              {
                icon: <ShieldCheck size={28} />,
                step: '04',
                title: 'Negócio seguro',
                desc: 'Pagamento protegido, liberação ao vendedor só após entrega confirmada.',
                color: 'brand-blue',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  item.color === 'brand-pink' ? 'bg-pink-100 text-brand-pink' : 'bg-blue-100 text-brand-blue'
                }`}>
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-gray-300 tracking-wider">{item.step}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For sellers */}
      <section id="para-vendedores" className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-brand-pink to-brand-pink-light rounded-3xl p-8 sm:p-12 text-white">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-4">
                  <Zap size={14} /> Para vendedores
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Encontre compradores já decididos</h2>
                <p className="text-pink-100 text-lg mb-6">
                  Não perca tempo esperando. Aqui os compradores já sabem o que querem e estão prontos para pagar.
                </p>
                <Link to="/auth?tab=register"
                  className="inline-flex items-center gap-2 bg-white text-brand-pink font-bold px-6 py-3 rounded-xl hover:bg-pink-50 transition-colors">
                  Começar a vender <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '1.200+', label: 'Pedidos ativos' },
                  { value: '98%', label: 'Vendas concluídas' },
                  { value: 'R$ 0', label: 'Para se cadastrar' },
                  { value: '24h', label: 'Tempo médio de venda' },
                ].map(s => (
                  <div key={s.label} className="bg-white/20 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-extrabold">{s.value}</p>
                    <p className="text-sm text-pink-100">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categorias" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Categorias em destaque</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { emoji: '👟', label: 'Tênis & Calçados' },
              { emoji: '👜', label: 'Bolsas de Luxo' },
              { emoji: '⌚', label: 'Relógios de Luxo' },
              { emoji: '📱', label: 'Eletrônicos' },
              { emoji: '🎸', label: 'Instrumentos' },
              { emoji: '👗', label: 'Roupas & Moda' },
              { emoji: '🎨', label: 'Arte & Coleções' },
              { emoji: '⚽', label: 'Esportes' },
              { emoji: '💎', label: 'Acessórios' },
              { emoji: '✨', label: 'Outros' },
            ].map(cat => (
              <Link key={cat.label} to="/auth"
                className="bg-white border border-gray-100 rounded-2xl p-4 text-center hover:border-brand-pink hover:shadow-md transition-all group">
                <span className="text-3xl block mb-2">{cat.emoji}</span>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-brand-pink">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Pronto para encontrar o que você procura?
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Cadastre-se gratuitamente e publique seu primeiro pedido em menos de 2 minutos.
          </p>
          <Link to="/auth?tab=register"
            className="inline-flex items-center gap-2 bg-brand-pink text-white font-bold px-8 py-4 rounded-2xl hover:bg-brand-pink-dark transition-all shadow-lg shadow-pink-200 text-lg">
            Criar conta grátis <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-xl">Mercari</span>
            <span className="text-gray-600 text-sm">&copy; 2026</span>
          </div>
          <p className="text-sm text-center">O marketplace invertido para peças raras e de luxo</p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
