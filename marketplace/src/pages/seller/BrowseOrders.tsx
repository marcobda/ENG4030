import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp, CATEGORIES } from '../../context/AppContext';
import AppLayout from '../../components/AppLayout';
import { Search, Tag, ChevronRight, MessageSquare, Clock, X } from 'lucide-react';

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
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const activeOrders = orders.filter(o => o.status === 'active');

  const catFiltered = activeOrders.filter(o =>
    selectedCategory === 'Todos' || o.category === selectedCategory
  );

  // Aggregate available tags from category-filtered orders
  const tagCounts = new Map<string, number>();
  for (const o of catFiltered) {
    for (const t of (o.tags ?? [])) {
      tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
    }
  }
  const availableTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);

  const filtered = catFiltered.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.product.toLowerCase().includes(q) ||
      o.brand.toLowerCase().includes(q) ||
      o.category.toLowerCase().includes(q) ||
      o.characteristics.toLowerCase().includes(q) ||
      (o.tags ?? []).some(t => t.toLowerCase().includes(q));
    const matchTags = selectedTags.size === 0 || [...selectedTags].every(t => (o.tags ?? []).includes(t));
    return matchSearch && matchTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  };

  const clearTags = () => setSelectedTags(new Set());

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
            placeholder="Buscar por produto, marca, categoria ou tag..."
            className="w-full border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:border-brand-pink focus:ring-2 focus:ring-pink-100 transition-all bg-white"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); clearTags(); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                selectedCategory === cat
                  ? 'bg-brand-pink text-white border-brand-pink shadow-sm shadow-pink-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-pink hover:text-brand-pink'
              }`}>
              {cat === 'Todos' ? `Todos (${activeOrders.length})` : cat}
            </button>
          ))}
        </div>

        {/* Tag filter panel */}
        {availableTags.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Filtrar por tags</p>
              {selectedTags.size > 0 && (
                <button onClick={clearTags} className="text-xs text-brand-pink font-semibold flex items-center gap-1 hover:underline">
                  <X size={11} /> Limpar filtros
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map(tag => {
                const active = selectedTags.has(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                      active
                        ? 'bg-brand-blue text-white border-brand-blue'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-brand-blue hover:text-brand-blue'
                    }`}>
                    {tag}
                    <span className="ml-1 opacity-60">({tagCounts.get(tag)})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Results count */}
        {(search || selectedCategory !== 'Todos' || selectedTags.size > 0) ? (
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
            <p className="text-sm text-gray-500">Tente outra categoria, tag ou termo de busca.</p>
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

                  {/* Tags */}
                  {order.tags && order.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {order.tags.slice(0, 4).map(tag => (
                        <span
                          key={tag}
                          onClick={e => { e.preventDefault(); toggleTag(tag); }}
                          className={`text-[10px] px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                            selectedTags.has(tag)
                              ? 'bg-brand-blue text-white border-brand-blue'
                              : 'bg-blue-50 text-brand-blue border-blue-100 hover:bg-brand-blue hover:text-white'
                          }`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

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
