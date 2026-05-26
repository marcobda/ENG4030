import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AppLayout from '../components/AppLayout';
import { ArrowLeft, Send, ShieldAlert, DollarSign, CheckCircle2 } from 'lucide-react';

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yest = new Date(); yest.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Hoje';
  if (d.toDateString() === yest.toDateString()) return 'Ontem';
  return formatDate(iso);
}

export default function Messages() {
  const { offerId } = useParams<{ offerId: string }>();
  const { offers, orders, user, getChannelMessages, sendMessage, acceptCounterPrice } = useApp();

  const offer = offers.find(o => o.id === offerId);
  const order = offer ? orders.find(o => o.id === offer.orderId) : undefined;
  const msgs = getChannelMessages(offerId ?? '');

  const [text, setText] = useState('');
  const [counter, setCounter] = useState('');
  const [showCounter, setShowCounter] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs.length]);

  if (!offer || !order || !user) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <p className="text-gray-500">Canal não encontrado.</p>
          <Link to="/" className="mt-4 inline-block text-brand-pink font-semibold">Início</Link>
        </div>
      </AppLayout>
    );
  }

  const isBuyer = user.id === order.buyerId;
  const isSeller = user.id === offer.sellerId;

  if (!isBuyer && !isSeller) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <p className="text-gray-500">Você não tem acesso a este canal.</p>
        </div>
      </AppLayout>
    );
  }

  const backUrl = isBuyer
    ? `/buyer/orders/${order.id}/offers`
    : `/seller/my-offers`;

  const otherName = isBuyer ? offer.sellerName : order.buyerName;

  const handleSend = () => {
    const content = text.trim();
    if (!content) return;
    const cp = showCounter && counter ? parseFloat(counter.replace(',', '.')) : undefined;
    sendMessage({
      offerId: offer.id,
      orderId: order.id,
      buyerId: order.buyerId,
      buyerName: order.buyerName,
      sellerId: offer.sellerId,
      sellerName: offer.sellerName,
      senderId: user.id,
      senderName: user.name,
      senderRole: isBuyer ? 'buyer' : 'seller',
      content,
      counterPrice: cp,
    });
    setText('');
    setCounter('');
    setShowCounter(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Group messages by day
  let lastDay = '';

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <Link to={backUrl} className="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center">
            <ArrowLeft size={16} className="text-gray-600" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-extrabold text-gray-900 truncate">{otherName}</h1>
            <p className="text-xs text-gray-400 truncate">{order.product}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold text-brand-pink">{formatBRL(offer.price)}</p>
            <p className="text-xs text-gray-400">oferta atual</p>
          </div>
        </div>

        {/* Mercari access banner */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-3">
          <ShieldAlert size={16} className="text-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-800 font-medium">
            A Mercari monitora todos os canais de conversa para garantir a segurança das negociações.
          </p>
        </div>

        {/* Messages thread */}
        <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-1 mb-3">
          {msgs.length === 0 && (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="text-gray-400 text-sm">Nenhuma mensagem ainda.</p>
                <p className="text-gray-300 text-xs mt-1">Inicie a negociação abaixo.</p>
              </div>
            </div>
          )}

          {msgs.map(msg => {
            const mine = msg.senderId === user.id;
            const dayStr = dayLabel(msg.createdAt);
            const showDay = dayStr !== lastDay;
            lastDay = dayStr;

            return (
              <div key={msg.id}>
                {showDay && (
                  <div className="flex items-center gap-2 my-3">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-xs text-gray-400 font-medium px-2">{dayStr}</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                )}
                <div className={`flex ${mine ? 'justify-end' : 'justify-start'} mb-1`}>
                  <div className={`max-w-[78%] ${mine ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!mine && (
                      <span className="text-xs text-gray-400 ml-1 mb-0.5">{msg.senderName}</span>
                    )}
                    <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                      mine
                        ? 'bg-brand-pink text-white rounded-tr-sm'
                        : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                    }`}>
                      {msg.counterPrice !== undefined && (
                        <div className={`flex items-center gap-1 text-xs font-bold mb-1.5 ${mine ? 'text-pink-100' : 'text-brand-pink'}`}>
                          <DollarSign size={11} />
                          Contra-proposta: {formatBRL(msg.counterPrice)}
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {/* Accept counter-price button: shown to seller when buyer proposes a price */}
                    {msg.counterPrice !== undefined && msg.senderRole === 'buyer' && isSeller && (
                      offer.price === msg.counterPrice ? (
                        <div className="flex items-center gap-1 text-xs text-green-600 font-semibold mt-1 ml-1">
                          <CheckCircle2 size={12} /> Proposta aceita
                        </div>
                      ) : (
                        <button
                          onClick={() => acceptCounterPrice(offer.id, msg.counterPrice!)}
                          className="mt-1 ml-1 text-xs font-bold text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-full transition-colors">
                          Aceitar {formatBRL(msg.counterPrice)}
                        </button>
                      )
                    )}
                    {/* Auto-updated label: shown when seller's counter-price is the current price */}
                    {msg.counterPrice !== undefined && msg.senderRole === 'seller' && (
                      <div className={`flex items-center gap-1 text-[10px] font-medium mt-1 ${mine ? 'text-gray-400 mr-1 justify-end' : 'text-gray-400 ml-1'}`}>
                        {offer.price === msg.counterPrice
                          ? <><CheckCircle2 size={10} className="text-green-500" /> Preço atualizado</>
                          : 'Substituído por proposta mais recente'
                        }
                      </div>
                    )}
                    <span className={`text-[10px] mt-0.5 ${mine ? 'text-gray-400 mr-1' : 'text-gray-400 ml-1'}`}>
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          {/* Counter-price toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCounter(v => !v)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1 ${
                showCounter
                  ? 'bg-brand-pink text-white border-brand-pink'
                  : 'border-gray-200 text-gray-500 hover:border-brand-pink hover:text-brand-pink'
              }`}>
              <DollarSign size={11} />
              {showCounter ? 'Remover contra-proposta' : 'Adicionar contra-proposta de preço'}
            </button>
          </div>

          {showCounter && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-500 flex-shrink-0">R$</span>
              <input
                value={counter}
                onChange={e => setCounter(e.target.value)}
                placeholder={`Ex.: ${Math.round(offer.price * 0.9).toLocaleString('pt-BR')},00`}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-brand-pink focus:ring-2 focus:ring-pink-100 transition-all"
              />
            </div>
          )}

          <div className="flex items-end gap-2">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Digite sua mensagem... (Enter para enviar)"
              rows={2}
              maxLength={500}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:border-brand-pink focus:ring-2 focus:ring-pink-100 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="flex-shrink-0 w-10 h-10 bg-brand-pink text-white rounded-xl flex items-center justify-center hover:bg-brand-pink-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-pink-200">
              <Send size={16} />
            </button>
          </div>
          <p className="text-right text-xs text-gray-300">{text.length}/500</p>
        </div>
      </div>
    </AppLayout>
  );
}
