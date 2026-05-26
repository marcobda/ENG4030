import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import AppLayout from '../../components/AppLayout';
import { Clock, CheckCircle2, XCircle, Send, Package, Tag, ChevronRight, Camera, Star, MessageCircle } from 'lucide-react';

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function MyOffers() {
  const { getMyOffers, orders, hasRated, getChannelMessages } = useApp();
  const myOffers = getMyOffers();

  const enriched = myOffers
    .map(offer => ({ offer, order: orders.find(o => o.id === offer.orderId) }))
    .filter(e => e.order !== undefined)
    .sort((a, b) => new Date(b.offer.createdAt).getTime() - new Date(a.offer.createdAt).getTime());

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-blue-100 rounded-2xl flex items-center justify-center">
            <Send size={22} className="text-brand-pink" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Minhas Ofertas</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {enriched.length} oferta{enriched.length !== 1 ? 's' : ''} enviada{enriched.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {enriched.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Send size={28} className="text-brand-pink" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Nenhuma oferta enviada</h2>
            <p className="text-gray-500 text-sm mb-6">Explore os pedidos disponíveis e envie sua primeira oferta.</p>
            <Link to="/seller/orders"
              className="inline-flex items-center gap-2 bg-brand-pink text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-pink-dark transition-colors">
              <Package size={16} /> Ver pedidos
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {enriched.map(({ offer, order }) => {
              const isAccepted = offer.status === 'accepted';
              const isRejected = offer.status === 'rejected';
              const rated = hasRated(offer.id, 'seller');
              const msgCount = getChannelMessages(offer.id).length;
              return (
                <div
                  key={offer.id}
                  className={`bg-white rounded-2xl border-2 shadow-sm p-5 transition-all ${
                    isAccepted ? 'border-green-200' : isRejected ? 'border-gray-100 opacity-60' : 'border-gray-100'
                  }`}
                >
                  <Link to={`/seller/orders/${order!.id}`} className="flex gap-4 hover:opacity-90 transition-opacity">
                    {/* Photo or placeholder */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                      {offer.photos && offer.photos.length > 0 ? (
                        <img src={offer.photos[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Camera size={20} className="text-gray-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {isAccepted && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                <CheckCircle2 size={11} /> Aceita
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                <XCircle size={11} /> Não aceita
                              </span>
                            )}
                            {offer.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                                <Clock size={10} /> Aguardando
                              </span>
                            )}
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Tag size={10} /> {order!.category}
                            </span>
                          </div>
                          <p className="font-bold text-gray-900 truncate">{order!.product}</p>
                          {order!.brand && <p className="text-sm text-gray-500">{order!.brand}</p>}
                        </div>
                        <ChevronRight size={16} className="text-gray-300 flex-shrink-0 mt-1" />
                      </div>

                      <div className="flex items-center gap-4 mt-2">
                        <div>
                          <p className="text-lg font-extrabold text-brand-pink">{formatBRL(offer.price)}</p>
                          <p className="text-xs text-gray-400">seu preço ofertado</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          <p>{offer.deliveryDays} dia{offer.deliveryDays !== 1 ? 's' : ''} úteis</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock size={10} /> {formatDate(offer.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Messages + rate buyer (for accepted offers) */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <Link to={`/messages/${offer.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue/80 transition-colors">
                      <MessageCircle size={14} /> Mensagens
                      {msgCount > 0 && (
                        <span className="bg-brand-blue text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">{msgCount}</span>
                      )}
                    </Link>
                    {isAccepted && (
                      rated ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" /> Comprador avaliado
                        </span>
                      ) : (
                        <Link to={`/seller/rate/${offer.id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-pink hover:text-brand-pink-dark transition-colors">
                          <Star size={14} /> Avaliar comprador
                        </Link>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
