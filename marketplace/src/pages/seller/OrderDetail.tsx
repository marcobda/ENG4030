import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import AppLayout from '../../components/AppLayout';
import PhotoUpload from '../../components/PhotoUpload';
import { ArrowLeft, Tag, Package, DollarSign, Truck, MessageSquare, CheckCircle2, Send, X, Camera } from 'lucide-react';

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20">
        <X size={20} />
      </button>
      <img src={src} alt="" className="max-w-full max-h-full rounded-lg object-contain" onClick={e => e.stopPropagation()} />
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { orders, getOrderOffers, submitOffer, hasOfferedOnOrder, user } = useApp();
  const navigate = useNavigate();

  const order = orders.find(o => o.id === id);
  const existingOffers = getOrderOffers(id ?? '');
  const alreadyOffered = hasOfferedOnOrder(id ?? '');
  const myOffer = existingOffers.find(o => o.sellerId === user?.id);

  const [price, setPrice] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('3');
  const [message, setMessage] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  if (!order) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <p className="text-gray-500">Pedido não encontrado.</p>
          <Link to="/seller/orders" className="mt-4 inline-block text-brand-pink font-semibold">Voltar</Link>
        </div>
      </AppLayout>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    const p = parseFloat(price.replace(',', '.'));
    if (!price || isNaN(p) || p <= 0) e.price = 'Informe um preço válido.';
    const d = parseInt(deliveryDays);
    if (!deliveryDays || isNaN(d) || d < 1) e.deliveryDays = 'Informe o prazo de entrega.';
    if (photos.length === 0) e.photos = 'Adicione pelo menos 1 foto do produto.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!user) return;

    submitOffer({
      orderId: order.id,
      sellerId: user.id,
      sellerName: user.name,
      sellerRating: user.rating ?? 0,
      sellerReviews: user.reviews ?? 0,
      sellerVerified: (user.reviews ?? 0) > 10,
      sellerLocation: user.location ?? 'BR',
      price: parseFloat(price.replace(',', '.')),
      deliveryDays: parseInt(deliveryDays),
      message: message.trim(),
      photos,
    });
    setSubmitted(true);
    setTimeout(() => navigate('/seller/orders'), 2000);
  };

  if (submitted) {
    return (
      <AppLayout>
        <div className="max-w-lg mx-auto flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={36} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Oferta enviada!</h2>
          <p className="text-gray-500">Sua oferta foi enviada ao comprador. Aguarde a resposta. Redirecionando...</p>
        </div>
      </AppLayout>
    );
  }

  const offerCount = existingOffers.length;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <Link to="/seller/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft size={16} /> Pedidos disponíveis
        </Link>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Order details */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-pink-50 text-brand-pink border border-pink-100">
                  <Tag size={11} /> {order.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>Ativo
                </span>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center">
                  <Package size={20} className="text-brand-pink" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-gray-900">{order.product}</h1>
                  {order.brand && <p className="text-gray-500 text-sm">{order.brand}</p>}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Características</p>
                  <p className="text-gray-700">{order.characteristics}</p>
                </div>
                {order.description && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Descrição</p>
                    <p className="text-gray-700">{order.description}</p>
                  </div>
                )}

                {/* Buyer reference photos */}
                {order.photos && order.photos.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Fotos de referência do comprador</p>
                    <div className="flex gap-2 flex-wrap">
                      {order.photos.map((src, i) => (
                        <button key={i} type="button" onClick={() => setLightboxSrc(src)}
                          className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 hover:opacity-90 transition-opacity">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {order.tags && order.tags.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {order.tags.map(t => (
                        <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-brand-blue border border-blue-100 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-gray-500">Preço desejado</span>
                  <span className="text-xl font-extrabold text-brand-pink">{formatBRL(order.desiredPrice)}</span>
                </div>
              </div>
            </div>

            {/* Competition hint — no prices shown */}
            {offerCount > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
                <MessageSquare size={18} className="text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  <strong>{offerCount}</strong> vendedor{offerCount !== 1 ? 'es' : ''} já {offerCount !== 1 ? 'enviaram ofertas' : 'enviou oferta'} para este pedido.
                  Envie sua melhor proposta para se destacar.
                </p>
              </div>
            )}
          </div>

          {/* Offer form */}
          <div className="lg:col-span-2">
            {alreadyOffered && myOffer ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={22} className="text-green-600" />
                  <h3 className="font-bold text-green-800">Oferta enviada!</h3>
                </div>
                <p className="text-sm text-green-700 mb-4">Você já enviou uma oferta para este pedido.</p>
                <div className="bg-white rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Preço ofertado</span>
                    <span className="text-sm font-bold text-gray-900">{formatBRL(myOffer.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Prazo</span>
                    <span className="text-sm font-bold text-gray-900">{myOffer.deliveryDays} dias úteis</span>
                  </div>
                  {myOffer.message && (
                    <div>
                      <span className="text-sm text-gray-500">Mensagem</span>
                      <p className="text-sm text-gray-700 mt-0.5 italic">"{myOffer.message}"</p>
                    </div>
                  )}
                  {myOffer.photos && myOffer.photos.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Fotos enviadas</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {myOffer.photos.map((src, i) => (
                          <button key={i} type="button" onClick={() => setLightboxSrc(src)}
                            className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : order.status === 'closed' ? (
              <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 text-center">
                <p className="text-gray-500 text-sm">Este pedido foi fechado e não aceita mais ofertas.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                  <Send size={18} className="text-brand-pink" /> Enviar Oferta
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-1.5">
                      <DollarSign size={14} className="text-brand-pink" /> Seu preço *
                    </label>
                    <div className="flex">
                      <span className="border border-r-0 border-gray-200 bg-gray-50 rounded-l-xl px-3 py-2.5 text-sm font-semibold text-gray-600">R$</span>
                      <input value={price} onChange={e => setPrice(e.target.value)}
                        placeholder="0,00"
                        className={`flex-1 border rounded-r-xl px-3 py-2.5 text-sm transition-all focus:ring-2 ${
                          errors.price ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-brand-pink focus:ring-pink-100'
                        }`} />
                    </div>
                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-1.5">
                      <Truck size={14} className="text-brand-pink" /> Prazo de entrega (dias úteis) *
                    </label>
                    <input type="number" min="1" max="60" value={deliveryDays} onChange={e => setDeliveryDays(e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm transition-all focus:ring-2 ${
                        errors.deliveryDays ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-brand-pink focus:ring-pink-100'
                      }`} />
                    {errors.deliveryDays && <p className="text-xs text-red-500 mt-1">{errors.deliveryDays}</p>}
                  </div>

                  {/* Required photos */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-2">
                      <Camera size={14} className="text-brand-pink" /> Fotos do produto *
                    </label>
                    <PhotoUpload
                      photos={photos}
                      onChange={p => { setPhotos(p); if (p.length > 0) setErrors(prev => ({ ...prev, photos: '' })); }}
                      maxPhotos={5}
                      required
                      error={errors.photos}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-1.5">
                      <MessageSquare size={14} className="text-brand-pink" /> Mensagem (opcional)
                    </label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)}
                      placeholder="Ex.: Produto novo na caixa, com nota fiscal..."
                      rows={3} maxLength={300}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:border-brand-pink focus:ring-2 focus:ring-pink-100 transition-all" />
                    <p className="text-right text-xs text-gray-400">{message.length}/300</p>
                  </div>

                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-brand-pink text-white font-bold py-3 rounded-xl hover:bg-brand-pink-dark transition-all shadow-sm shadow-pink-200 text-sm">
                    <Send size={15} /> Enviar Oferta
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </AppLayout>
  );
}
