import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import AppLayout from '../../components/AppLayout';
import {
  Star, Truck, ShieldCheck, ArrowLeft, CheckCircle2,
  ChevronLeft, ChevronRight, X, Camera, MapPin, Award,
} from 'lucide-react';

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20">
        <X size={20} />
      </button>
      <img src={src} alt="" className="max-w-full max-h-full rounded-lg object-contain" onClick={e => e.stopPropagation()} />
    </div>
  );
}

function PhotoGallery({ photos, onLightbox }: { photos: string[]; onLightbox: (src: string) => void }) {
  const [idx, setIdx] = useState(0);
  if (photos.length === 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
        <Camera size={13} /> Sem fotos do produto
      </div>
    );
  }
  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => (i - 1 + photos.length) % photos.length); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => (i + 1) % photos.length); };

  return (
    <div className="mt-3">
      <div
        className="relative rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
        style={{ aspectRatio: '16/9' }}
        onClick={() => onLightbox(photos[idx])}
      >
        <img src={photos[idx]} alt="" className="w-full h-full object-cover" />
        {photos.length > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60">
              <ChevronLeft size={14} />
            </button>
            <button onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60">
              <ChevronRight size={14} />
            </button>
            <span className="absolute top-2 right-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full font-medium">
              {idx + 1}/{photos.length}
            </span>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div className="flex gap-1.5 mt-1.5 overflow-x-auto">
          {photos.map((src, i) => (
            <button key={i} type="button" onClick={() => setIdx(i)}
              className={`flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 transition-colors ${i === idx ? 'border-brand-pink' : 'border-transparent'}`}>
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrderOffers() {
  const { id } = useParams<{ id: string }>();
  const { orders, getOrderOffers, acceptOffer } = useApp();
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

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
      <div className="max-w-4xl mx-auto">
        <Link to="/buyer/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft size={16} /> Meus pedidos
        </Link>

        <div className="flex items-start justify-between mb-4 gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Quadro comparativo de ofertas</h1>
            <p className="text-sm text-gray-500 mt-0.5">{order.product}</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-pink-50 text-brand-pink border border-pink-100 flex-shrink-0">
            {rawOffers.length} oferta{rawOffers.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Order summary bar */}
        <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl p-4 mb-6 border border-pink-100 flex gap-3 items-start">
          {order.photos && order.photos.length > 0 && (
            <div className="flex gap-1.5 flex-shrink-0">
              {order.photos.slice(0, 3).map((src, i) => (
                <button key={i} type="button" onClick={() => setLightboxSrc(src)}
                  className="w-12 h-12 rounded-lg overflow-hidden border border-pink-200 flex-shrink-0 hover:opacity-90">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{order.product}</p>
            <p className="text-xs text-gray-500 mt-0.5">{order.brand && `${order.brand} · `}{order.category}</p>
            <p className="text-sm font-extrabold text-brand-pink mt-1">Preço desejado: {formatBRL(order.desiredPrice)}</p>
          </div>
        </div>

        {order.status === 'closed' && accepted && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
            <CheckCircle2 size={28} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-green-800">Oferta aceita!</p>
              <p className="text-sm text-green-700">Você aceitou a oferta de {accepted.sellerName} por {formatBRL(accepted.price)}.</p>
            </div>
          </div>
        )}

        {rawOffers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-gray-500 text-sm">Nenhuma oferta recebida ainda. Aguarde vendedores enviarem propostas.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rawOffers.map(offer => {
              const isBest = offer.price === lowestPrice && order.status === 'active' && offer.status !== 'rejected';
              const isAccepted = offer.status === 'accepted';
              const isRejected = offer.status === 'rejected';

              return (
                <div key={offer.id}
                  className={`bg-white rounded-2xl border-2 shadow-sm flex flex-col transition-all ${
                    isAccepted ? 'border-green-400 shadow-green-100'
                    : isBest ? 'border-brand-pink shadow-pink-100'
                    : 'border-gray-100'
                  } ${isRejected ? 'opacity-50' : ''}`}>

                  {/* Card header: best / accepted badge */}
                  {(isBest || isAccepted) && (
                    <div className={`px-4 py-2 rounded-t-2xl text-xs font-bold flex items-center gap-1 ${
                      isAccepted ? 'bg-green-500 text-white' : 'bg-brand-pink text-white'
                    }`}>
                      {isAccepted ? <><CheckCircle2 size={12} /> Oferta aceita</> : <><Award size={12} /> Melhor preço</>}
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    {/* Seller info */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center text-xl font-bold text-brand-pink flex-shrink-0">
                        {offer.sellerName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            to={`/seller/profile/${offer.sellerId}`}
                            className="font-bold text-gray-900 hover:text-brand-pink transition-colors text-sm leading-tight"
                            onClick={e => e.stopPropagation()}
                          >
                            {offer.sellerName}
                          </Link>
                          {offer.sellerVerified && <ShieldCheck size={13} className="text-brand-blue flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star size={11} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold text-gray-700">{offer.sellerRating.toFixed(1)}</span>
                          <span className="text-xs text-gray-400">({offer.sellerReviews})</span>
                        </div>
                        {offer.sellerLocation && (
                          <div className="flex items-center gap-0.5 text-xs text-gray-400 mt-0.5">
                            <MapPin size={10} /> {offer.sellerLocation}
                          </div>
                        )}
                        <Link
                          to={`/seller/profile/${offer.sellerId}`}
                          className="text-xs text-brand-blue hover:underline mt-1 inline-block"
                          onClick={e => e.stopPropagation()}
                        >
                          Ver produtos vendidos →
                        </Link>
                      </div>
                    </div>

                    {/* Price + delivery row */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-3">
                      <div>
                        <p className={`text-2xl font-extrabold ${isAccepted ? 'text-green-600' : isBest ? 'text-brand-pink' : 'text-gray-900'}`}>
                          {formatBRL(offer.price)}
                        </p>
                        <p className="text-xs text-gray-400">preço ofertado</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Truck size={12} className="text-gray-400" />
                          <span className="text-sm font-semibold text-gray-700">{offer.deliveryDays}d úteis</span>
                        </div>
                        <p className="text-xs text-gray-400">entrega</p>
                      </div>
                    </div>

                    {/* Message */}
                    {offer.message && (
                      <p className="text-xs text-gray-600 italic mb-3 line-clamp-2">"{offer.message}"</p>
                    )}

                    {/* Photos */}
                    <PhotoGallery photos={offer.photos ?? []} onLightbox={setLightboxSrc} />

                    {/* Accept button */}
                    {order.status === 'active' && !isRejected && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => acceptOffer(offer.id, order.id)}
                          className={`w-full font-bold text-sm py-2.5 rounded-xl transition-all ${
                            isBest
                              ? 'bg-brand-pink text-white hover:bg-brand-pink-dark shadow-sm shadow-pink-200'
                              : 'border-2 border-brand-pink text-brand-pink hover:bg-pink-50'
                          }`}>
                          Aceitar Oferta
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-xs text-gray-400 text-center mt-6">
          ⓘ Ao aceitar uma oferta, o vendedor será notificado e você poderá concluir a compra.
        </p>
      </div>

      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </AppLayout>
  );
}
