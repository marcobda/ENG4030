import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import AppLayout from '../../components/AppLayout';
import { PlusCircle, ChevronRight, MessageSquare, Clock, CheckCircle2, Tag } from 'lucide-react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function MyOrders() {
  const { getMyOrders } = useApp();
  const orders = getMyOrders();

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Meus Pedidos</h1>
            <p className="text-gray-500 text-sm mt-0.5">{orders.length} pedido{orders.length !== 1 ? 's' : ''} publicado{orders.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/buyer/orders/create"
            className="flex items-center gap-2 bg-brand-pink text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-brand-pink-dark transition-colors shadow-sm shadow-pink-200">
            <PlusCircle size={16} /> Novo pedido
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={28} className="text-brand-pink" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Nenhum pedido ainda</h2>
            <p className="text-gray-500 text-sm mb-6">Publique seu primeiro pedido e receba ofertas de vendedores especializados.</p>
            <Link to="/buyer/orders/create"
              className="inline-flex items-center gap-2 bg-brand-pink text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-pink-dark transition-colors">
              <PlusCircle size={16} /> Criar primeiro pedido
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          order.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {order.status === 'active'
                            ? <><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>Ativo</>
                            : <><CheckCircle2 size={11} />Fechado</>}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Tag size={11} /> {order.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 truncate">{order.product}</h3>
                      {order.brand && <p className="text-sm text-gray-500 mt-0.5">{order.brand}</p>}
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{order.characteristics}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-extrabold text-brand-pink text-lg">{formatBRL(order.desiredPrice)}</p>
                      <p className="text-xs text-gray-400">preço desejado</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          order.offerCount > 0 ? 'bg-brand-pink text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {order.offerCount}
                        </div>
                        <span className="text-sm text-gray-500">oferta{order.offerCount !== 1 ? 's' : ''}</span>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} /> {formatDate(order.createdAt)}
                      </span>
                    </div>

                    {order.offerCount > 0 && order.status === 'active' && (
                      <Link to={`/buyer/orders/${order.id}/offers`}
                        className="flex items-center gap-1 text-sm font-semibold text-brand-pink hover:text-brand-pink-dark transition-colors">
                        Ver ofertas <ChevronRight size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
