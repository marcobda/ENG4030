import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import AppLayout from '../../components/AppLayout';
import { ArrowLeft, Star, ShieldCheck, MapPin, Package, CheckCircle2, Clock, Tag } from 'lucide-react';

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function SellerProfile() {
  const { sellerId } = useParams<{ sellerId: string }>();
  const { getSellerOffers, orders } = useApp();

  const sellerOffers = getSellerOffers(sellerId ?? '');
  const acceptedOffers = sellerOffers.filter(o => o.status === 'accepted');

  if (sellerOffers.length === 0) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <p className="text-gray-500">Vendedor não encontrado.</p>
          <Link to="/buyer/orders" className="mt-4 inline-block text-brand-pink font-semibold">Voltar</Link>
        </div>
      </AppLayout>
    );
  }

  const info = sellerOffers[0];
  const sellerName = info.sellerName;
  const sellerRating = info.sellerRating;
  const sellerReviews = info.sellerReviews;
  const sellerVerified = info.sellerVerified;
  const sellerLocation = info.sellerLocation;

  const enrichedAccepted = acceptedOffers
    .map(offer => ({ offer, order: orders.find(o => o.id === offer.orderId) }))
    .filter(e => e.order !== undefined)
    .sort((a, b) => new Date(b.offer.createdAt).getTime() - new Date(a.offer.createdAt).getTime());

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Link to="/buyer/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-5">
          <ArrowLeft size={16} /> Voltar
        </Link>

        {/* Seller header card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-pink to-brand-blue flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
              {sellerName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold text-gray-900">{sellerName}</h1>
                {sellerVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue border border-blue-100">
                    <ShieldCheck size={12} /> Verificado
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-gray-800">{sellerRating.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({sellerReviews} avaliações)</span>
                </div>
                {sellerLocation && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={13} /> {sellerLocation}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="text-center">
                  <p className="text-lg font-extrabold text-gray-900">{sellerOffers.length}</p>
                  <p className="text-xs text-gray-400">ofertas enviadas</p>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div className="text-center">
                  <p className="text-lg font-extrabold text-green-600">{acceptedOffers.length}</p>
                  <p className="text-xs text-gray-400">vendas concluídas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sold items */}
        <h2 className="text-base font-bold text-gray-900 mb-3">
          Produtos já vendidos ({enrichedAccepted.length})
        </h2>

        {enrichedAccepted.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
            Ainda sem vendas concluídas.
          </div>
        ) : (
          <div className="space-y-3">
            {enrichedAccepted.map(({ offer, order }) => (
              <div key={offer.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3">
                {/* Product photo from offer */}
                <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                  {offer.photos && offer.photos.length > 0 ? (
                    <img src={offer.photos[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package size={18} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                      <CheckCircle2 size={11} /> Vendido
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Tag size={10} /> {order!.category}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 truncate text-sm">{order!.product}</p>
                  {order!.brand && <p className="text-xs text-gray-500">{order!.brand}</p>}
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={10} /> {formatDate(offer.createdAt)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-extrabold text-brand-pink">{formatBRL(offer.price)}</p>
                  <p className="text-xs text-gray-400">{offer.deliveryDays}d úteis</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
