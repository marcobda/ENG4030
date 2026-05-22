import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp, CATEGORIES } from '../../context/AppContext';
import AppLayout from '../../components/AppLayout';
import { Search, Tag, ChevronRight, MessageSquare, Clock } from 'lucide-react';

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export default function BrowseOrders() {
  const { orders, hasOfferedOnOrder } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  const activeOrders = orders.filter(o => o.status === 'active');

  const filtered = activeOrders.filter(o => {
    const matchCat = selectedCategory === 'Todos' || o.category === selectedCategory;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.product.toLowerCase().includes(q) ||
      o.brand.toLowerCase().includes(q) ||
      o.category.toLowerCase().includes(q) ||
      o.characteristics.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">Pedidos disponíveis</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {activeOrders.length} pedido{activeOrders.length !== 1 ? 's' : ''} aguardando ofertas
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por produto, marca ou categoria..."
            className="w-full border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:border-brand-pink focus:ring-2 focus:ring-pink-100 transition-all bg-white"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                selectedCategory === cat
                  ? 'bg-brand-pink text-white border-brand-pink shadow-sm shadow-pink-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-pink hover:text-brand-pink'
              }`}>
              {cat === 'Todos' ? `Todos (${activeOrders.length})` : cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {search || selectedCategory !== 'Todos' ? (
          <p className="text-sm text-gray-500 mb-4">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>
        ) : null}

        {/* Orders grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Nenhum pedido encontrado</h3>
            <p className="text-sm text-gray-500">Tente outra categoria ou termo de busca.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map(order => {
              const alreadyOffered = hasOfferedOnOrder(order.id);
              return (
                <Link
                  key={order.id}
                  to={`/seller/orders/${order.id}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-pink/30 transition-all p-5 block group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-50 text-brand-pink border border-pink-100">
                        <Tag size={10} /> {order.category}
                      </span>
                      {alreadyOffered && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                          Oferta enviada
                        </span>
                      )}
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-pink flex-shrink-0 transition-colors" />
                  </div>

                  <h3 className="font-bold text-gray-900 mb-0.5 line-clamp-1">{order.product}</h3>
                  {order.brand && <p className="text-sm text-gray-500 mb-1">{order.brand}</p>}
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{order.characteristics}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-extrabold text-brand-pink">{formatBRL(order.desiredPrice)}</p>
                      <p className="text-xs text-gray-400">preço desejado</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <MessageSquare size={12} className="text-gray-400" />
                        <span className="text-sm font-semibold text-gray-600">{order.offerCount} oferta{order.offerCount !== 1 ? 's' : ''}</span>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1 justify-end mt-0.5">
                        <Clock size={11} /> {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
