import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import AppLayout from '../../components/AppLayout';
import { Star, Truck, ShieldCheck, ArrowLeft, CheckCircle2, FileText } from 'lucide-react';

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function OrderOffers() {
  const { id } = useParams<{ id: string }>();
  const { orders, getOrderOffers, acceptOffer } = useApp();

  const order = orders.find(o => o.id === id);
  const rawOffers = getOrderOffers(id ?? '');
  const lowestPrice = rawOffers.length > 0 ? Math.min(...rawOffers.map(o => o.price)) : 0;

  if (!order) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <p className="text-gray-500">Pedido não encontrado.</p>
          <Link to="/buyer/orders" className="mt-4 inline-block text-brand-pink font-semibold">Voltar</Link>
        </div>
      </AppLayout>
    );
  }

  const accepted = rawOffers.find(o => o.status === 'accepted');

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Back + title */}
        <Link to="/buyer/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft size={16} /> Meus pedidos
        </Link>

        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-extrabold text-gray-900">Ofertas recebidas</h1>
          <Link to="/buyer/orders"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-xl hover:border-brand-pink hover:text-brand-pink transition-colors">
            <FileText size={14} /> Ver solicitação
          </Link>
        </div>

        {/* Order summary */}
        <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl p-4 mb-6 border border-pink-100">
          <p className="text-sm font-bold text-gray-900">{order.product}</p>
          <p className="text-xs text-gray-500 mt-0.5">{order.brand && `${order.brand} · `}{order.category}</p>
          <p className="text-xs text-gray-500 mt-1">{order.characteristics}</p>
          <p className="text-sm font-extrabold text-brand-pink mt-2">Preço desejado: {formatBRL(order.desiredPrice)}</p>
        </div>

        {order.status === 'closed' && accepted ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
            <CheckCircle2 size={28} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-green-800">Oferta aceita!</p>
              <p className="text-sm text-green-700">
                Você aceitou a oferta de {accepted.sellerName} por {formatBRL(accepted.price)}.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-4">
            Você recebeu <strong>{rawOffers.length}</strong> oferta{rawOffers.length !== 1 ? 's' : ''} de diferentes vendedores.
          </p>
        )}

        {rawOffers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-gray-500 text-sm">Nenhuma oferta recebida ainda. Aguarde vendedores enviarem propostas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rawOffers.map((offer, i) => {
              const isBest = offer.price === lowestPrice;
              const isAccepted = offer.status === 'accepted';
              const isRejected = offer.status === 'rejected';

              return (
                <div key={offer.id}
                  className={`bg-white rounded-2xl border-2 shadow-sm p-5 transition-all ${
                    isAccepted ? 'border-green-400 shadow-green-100'
                    : isBest && order.status === 'active' ? 'border-brand-pink shadow-pink-100'
                    : 'border-gray-100'
                  } ${isRejected ? 'opacity-50' : ''}`}>

                  {isBest && order.status === 'active' && !isRejected && (
                    <div className="flex justify-end mb-2">
                      <span className="inline-flex items-center gap-1 bg-brand-pink text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        ⭐ Melhor Preço
                      </span>
                    </div>
                  )}
                  {isAccepted && (
                    <div className="flex justify-end mb-2">
                      <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        <CheckCircle2 size={12} /> Aceita
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Seller avatar */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center text-lg font-bold text-brand-pink flex-shrink-0">
                      {offer.sellerName.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900">{offer.sellerName}</span>
                        {offer.sellerVerified && (
                          <ShieldCheck size={15} className="text-brand-blue flex-shrink-0" />
                        )}
                        {i < 3 && <span className="text-xs text-gray-400 font-medium">Vendedor confiável</span>}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={13} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">{offer.sellerRating.toFixed(1)}</span>
                        <span className="text-sm text-gray-400">({offer.sellerReviews} avaliações)</span>
                      </div>
                      {offer.message && (
                        <p className="text-sm text-gray-600 mt-2 italic">"{offer.message}"</p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className={`text-2xl font-extrabold ${
                        isAccepted ? 'text-green-600'
                        : isBest ? 'text-brand-pink'
                        : 'text-gray-900'
                      }`}>
                        {formatBRL(offer.price)}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <Truck size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Em até {offer.deliveryDays} dia{offer.deliveryDays !== 1 ? 's' : ''} úteis
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Enviado de {offer.sellerLocation}</p>
                    </div>
                  </div>

                  {order.status === 'active' && !isRejected && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={() => acceptOffer(offer.id, order.id)}
                        className={`font-bold text-sm px-6 py-2.5 rounded-xl transition-all ${
                          isBest
                            ? 'bg-brand-pink text-white hover:bg-brand-pink-dark shadow-sm shadow-pink-200'
                            : 'border-2 border-brand-pink text-brand-pink hover:bg-pink-50'
                        }`}>
                        Aceitar Oferta
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="text-xs text-gray-400 text-center mt-6">
          ⓘ Ao aceitar uma oferta, o vendedor será notificado e você poderá concluir a compra.
        </p>
      </div>
    </AppLayout>
  );
}
