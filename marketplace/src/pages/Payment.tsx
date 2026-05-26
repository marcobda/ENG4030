import { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useApp, SERVICE_FEE_RATE } from '../context/AppContext';
import AppLayout from '../components/AppLayout';
import { ArrowLeft, CheckCircle2, CreditCard, Smartphone, Landmark } from 'lucide-react';

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

type PaymentMethod = 'pix' | 'credit' | 'debit';

const METHODS: { id: PaymentMethod; label: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
  {
    id: 'pix',
    label: 'Pix',
    subtitle: 'Pagamento instantâneo',
    icon: <Smartphone size={24} />,
    color: 'border-green-300 bg-green-50 text-green-700',
  },
  {
    id: 'credit',
    label: 'Cartão de Crédito',
    subtitle: 'Em até 12x (sujeito a juros da operadora)',
    icon: <CreditCard size={24} />,
    color: 'border-brand-blue bg-blue-50 text-brand-blue',
  },
  {
    id: 'debit',
    label: 'Cartão de Débito',
    subtitle: 'Débito direto na conta',
    icon: <Landmark size={24} />,
    color: 'border-purple-300 bg-purple-50 text-purple-700',
  },
];

export default function Payment() {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const offerId = searchParams.get('offerId') ?? '';
  const navigate = useNavigate();
  const { orders, offers, acceptOffer } = useApp();

  const order = orders.find(o => o.id === orderId);
  const offer = offers.find(o => o.id === offerId);

  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  if (!order || !offer) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <p className="text-gray-500">Pedido ou oferta não encontrado.</p>
          <Link to="/buyer/orders" className="mt-4 inline-block text-brand-pink font-semibold">Voltar</Link>
        </div>
      </AppLayout>
    );
  }

  const fee = offer.price * SERVICE_FEE_RATE;
  const total = offer.price + fee;

  const handleConfirm = () => {
    if (!method) return;
    acceptOffer(offer.id, order.id);
    setConfirmed(true);
    setTimeout(() => navigate(`/buyer/rate/${offer.id}`), 2500);
  };

  if (confirmed) {
    return (
      <AppLayout>
        <div className="max-w-lg mx-auto flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-5">
            <CheckCircle2 size={44} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Pagamento confirmado!</h2>
          <p className="text-gray-500 mb-2">Sua compra foi finalizada com sucesso.</p>
          <p className="text-xs text-gray-400">Redirecionando para avaliação do vendedor...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto">
        <Link to={`/buyer/orders/${order.id}/offers`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-5">
          <ArrowLeft size={16} /> Voltar às ofertas
        </Link>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Pagamento</h1>

        {/* Order + offer summary */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Resumo do pedido</p>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center text-xl font-bold text-brand-pink flex-shrink-0">
              {offer.sellerName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-900">{order.product}</p>
              {order.brand && <p className="text-sm text-gray-500">{order.brand}</p>}
              <p className="text-xs text-gray-400 mt-0.5">Vendedor: <span className="font-semibold text-gray-700">{offer.sellerName}</span></p>
              <p className="text-xs text-gray-400">Entrega em até {offer.deliveryDays} dia{offer.deliveryDays !== 1 ? 's' : ''} úteis</p>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Preço do vendedor</span>
              <span>{formatBRL(offer.price)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Taxa de serviço Mercari (3%)</span>
              <span>{formatBRL(fee)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total a pagar</span>
              <span className="text-2xl font-extrabold text-brand-pink">{formatBRL(total)}</span>
            </div>
          </div>
        </div>

        {/* Payment method selection */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Forma de pagamento</p>
          <div className="space-y-3">
            {METHODS.map(m => (
              <button key={m.id} type="button" onClick={() => setMethod(m.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                  method === m.id
                    ? m.color + ' border-2'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  method === m.id ? 'bg-white/60' : 'bg-gray-50'
                }`}>
                  {m.icon}
                </div>
                <div>
                  <p className="font-bold text-sm">{m.label}</p>
                  <p className={`text-xs mt-0.5 ${method === m.id ? 'opacity-80' : 'text-gray-400'}`}>{m.subtitle}</p>
                </div>
                {method === m.id && (
                  <div className="ml-auto">
                    <CheckCircle2 size={20} className="text-current" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={!method}
          className="w-full flex items-center justify-center gap-2 bg-brand-pink text-white font-extrabold py-4 rounded-2xl hover:bg-brand-pink-dark transition-all shadow-md shadow-pink-200 text-base disabled:opacity-40 disabled:cursor-not-allowed mb-3">
          <CheckCircle2 size={20} /> Confirmar pagamento — {formatBRL(total)}
        </button>

        <Link to={`/buyer/orders/${order.id}/offers`}
          className="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors py-2">
          Cancelar e voltar às ofertas
        </Link>
      </div>
    </AppLayout>
  );
}
