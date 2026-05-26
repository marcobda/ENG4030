import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import AppLayout from '../../components/AppLayout';
import { Star, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RateBuyer() {
  const { offerId } = useParams<{ offerId: string }>();
  const { offers, orders, submitRating, hasRated, user } = useApp();
  const navigate = useNavigate();

  const offer = offers.find(o => o.id === offerId);
  const order = offer ? orders.find(o => o.id === offer.orderId) : undefined;
  const alreadyRated = hasRated(offerId ?? '', 'seller');

  const [score, setScore] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!offer || !order) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <p className="text-gray-500">Oferta não encontrada.</p>
          <Link to="/seller/my-offers" className="mt-4 inline-block text-brand-pink font-semibold">Minhas ofertas</Link>
        </div>
      </AppLayout>
    );
  }

  if (alreadyRated || submitted) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Star size={36} className="fill-yellow-400 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            {submitted ? 'Avaliação enviada!' : 'Você já avaliou este comprador'}
          </h2>
          <p className="text-gray-500 mb-6">
            {submitted ? `Obrigado por avaliar ${order.buyerName}. Seu feedback é importante.` : 'Obrigado pelo seu feedback!'}
          </p>
          <Link to="/seller/my-offers"
            className="inline-flex items-center gap-2 bg-brand-pink text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-pink-dark transition-colors">
            Minhas ofertas <ArrowRight size={16} />
          </Link>
        </div>
      </AppLayout>
    );
  }

  const handleSubmit = () => {
    if (!score || !user) return;
    submitRating({
      offerId: offer.id,
      orderId: order.id,
      raterId: user.id,
      raterName: user.name,
      rateeId: order.buyerId,
      rateeName: order.buyerName,
      raterRole: 'seller',
      score,
      comment: comment.trim(),
    });
    setSubmitted(true);
  };

  const labels = ['', 'Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente'];

  return (
    <AppLayout>
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-pink flex items-center justify-center text-4xl font-bold text-white mb-3">
              {order.buyerName.charAt(0)}
            </div>
            <h1 className="text-xl font-extrabold text-gray-900">Avalie {order.buyerName}</h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Como foi a experiência com este comprador em<br />
              <strong>{order.product}</strong>?
            </p>
          </div>

          {/* Star rating */}
          <div className="flex justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} type="button"
                onClick={() => setScore(s)}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110">
                <Star
                  size={40}
                  className={`transition-colors ${
                    s <= (hovered || score) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'
                  }`}
                />
              </button>
            ))}
          </div>
          {(hovered || score) > 0 && (
            <p className="text-center text-sm font-semibold text-gray-600 mb-5">{labels[hovered || score]}</p>
          )}

          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              Deixe um comentário (opcional)
            </label>
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Como foi a comunicação, pontualidade no pagamento..."
              rows={4} maxLength={500}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:border-brand-pink focus:ring-2 focus:ring-pink-100 transition-all" />
            <p className="text-right text-xs text-gray-400 mt-1">{comment.length}/500</p>
          </div>

          <button onClick={handleSubmit} disabled={!score}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-brand-pink text-white font-bold py-3.5 rounded-xl hover:bg-brand-pink-dark transition-all shadow-sm shadow-pink-200 disabled:opacity-40 disabled:cursor-not-allowed">
            <CheckCircle2 size={18} /> Enviar avaliação
          </button>

          <button onClick={() => navigate('/seller/my-offers')}
            className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors py-2">
            Pular por enquanto
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
