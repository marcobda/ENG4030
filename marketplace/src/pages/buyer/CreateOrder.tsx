import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, CATEGORIES } from '../../context/AppContext';
import AppLayout from '../../components/AppLayout';
import PhotoUpload from '../../components/PhotoUpload';
import { extractTags } from '../../utils/extractTags';
import { Package, Tag, Sparkles, DollarSign, FileText, ChevronDown, Send, Camera } from 'lucide-react';

export default function CreateOrder() {
  const { createOrder } = useApp();
  const navigate = useNavigate();

  const [product, setProduct] = useState('');
  const [brand, setBrand] = useState('');
  const [characteristics, setCharacteristics] = useState('');
  const [desiredPrice, setDesiredPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const liveTags = useMemo(
    () => extractTags(product, brand, characteristics, description),
    [product, brand, characteristics, description],
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!product.trim()) e.product = 'Informe o produto.';
    if (!characteristics.trim()) e.characteristics = 'Descreva as características.';
    if (!desiredPrice || isNaN(Number(desiredPrice.replace(',', '.')))) e.desiredPrice = 'Informe um preço válido.';
    if (!category) e.category = 'Selecione uma categoria.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    createOrder({
      product: product.trim(),
      brand: brand.trim(),
      characteristics: characteristics.trim(),
      desiredPrice: parseFloat(desiredPrice.replace(',', '.')),
      description: description.trim(),
      category,
      photos,
    });
    setSubmitted(true);
    setTimeout(() => navigate('/buyer/orders'), 2000);
  };

  if (submitted) {
    return (
      <AppLayout>
        <div className="max-w-lg mx-auto flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Send size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Pedido publicado!</h2>
          <p className="text-gray-500">Seu pedido foi publicado e vendedores já podem enviar ofertas. Redirecionando...</p>
        </div>
      </AppLayout>
    );
  }

  const cats = CATEGORIES.filter(c => c !== 'Todos');

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-blue-100 rounded-2xl flex items-center justify-center">
            <Package size={24} className="text-brand-pink" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Criar um pedido</h1>
            <p className="text-gray-500 text-sm">Conte o que você está procurando e receba ofertas.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
          {/* Product + Brand */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-1.5">
                <Package size={15} className="text-brand-pink" /> Produto *
              </label>
              <input value={product} onChange={e => setProduct(e.target.value)}
                placeholder="Ex.: Tênis Air Jordan 1"
                maxLength={80}
                className={`w-full border rounded-xl px-4 py-3 text-sm transition-all focus:ring-2 ${
                  errors.product ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-brand-pink focus:ring-pink-100'
                }`} />
              <div className="flex justify-between mt-1">
                {errors.product ? <p className="text-xs text-red-500">{errors.product}</p> : <span />}
                <span className="text-xs text-gray-400">{product.length}/80</span>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-1.5">
                <Tag size={15} className="text-brand-pink" /> Marca
              </label>
              <input value={brand} onChange={e => setBrand(e.target.value)}
                placeholder="Ex.: Nike, Rolex, Louis Vuitton"
                maxLength={40}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-pink focus:ring-2 focus:ring-pink-100 transition-all" />
              <p className="text-right text-xs text-gray-400 mt-1">{brand.length}/40</p>
            </div>
          </div>

          {/* Characteristics */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-1.5">
              <Sparkles size={15} className="text-brand-pink" /> Características *
            </label>
            <textarea value={characteristics} onChange={e => setCharacteristics(e.target.value)}
              placeholder="Ex.: Tamanho 42, cor preta, edição limitada, novo ou seminovo"
              maxLength={200} rows={2}
              className={`w-full border rounded-xl px-4 py-3 text-sm resize-none transition-all focus:ring-2 ${
                errors.characteristics ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-brand-pink focus:ring-pink-100'
              }`} />
            <div className="flex justify-between mt-1">
              {errors.characteristics ? <p className="text-xs text-red-500">{errors.characteristics}</p> : <p className="text-xs text-gray-400">Informe detalhes que ajudam a encontrar exatamente o que deseja.</p>}
              <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{characteristics.length}/200</span>
            </div>
          </div>

          {/* Price + Category */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-1.5">
                <DollarSign size={15} className="text-brand-pink" /> Preço Desejado *
              </label>
              <div className="flex">
                <span className="border border-r-0 border-gray-200 bg-gray-50 rounded-l-xl px-3 py-3 text-sm font-semibold text-gray-600">R$</span>
                <input value={desiredPrice} onChange={e => setDesiredPrice(e.target.value)}
                  placeholder="Ex.: 1.200,00"
                  className={`flex-1 border rounded-r-xl px-4 py-3 text-sm transition-all focus:ring-2 ${
                    errors.desiredPrice ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-brand-pink focus:ring-pink-100'
                  }`} />
              </div>
              {errors.desiredPrice && <p className="text-xs text-red-500 mt-1">{errors.desiredPrice}</p>}
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-1.5">
                <Tag size={15} className="text-brand-pink" /> Categoria *
              </label>
              <div className="relative">
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className={`w-full appearance-none border rounded-xl px-4 py-3 pr-9 text-sm bg-white transition-all focus:ring-2 ${
                    errors.category ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-brand-pink focus:ring-pink-100'
                  }`}>
                  <option value="">Selecione...</option>
                  {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-1.5">
              <FileText size={15} className="text-brand-pink" /> Descrição
            </label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Fale mais sobre o que você procura (opcional)"
              maxLength={1000} rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:border-brand-pink focus:ring-2 focus:ring-pink-100 transition-all" />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-400">Quanto mais detalhes, maiores as chances de encontrar o que deseja.</p>
              <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{description.length}/1000</span>
            </div>
          </div>

          {/* Live tag preview */}
          {liveTags.length > 0 && (
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-xs font-semibold text-brand-blue mb-2 flex items-center gap-1">
                <Sparkles size={12} /> Tags geradas automaticamente
              </p>
              <div className="flex flex-wrap gap-1.5">
                {liveTags.map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white border border-blue-200 text-brand-blue font-medium">
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">Vendedores poderão filtrar pedidos por essas tags.</p>
            </div>
          )}

          {/* Photos (optional) */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-2">
              <Camera size={15} className="text-brand-pink" /> Fotos de referência <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <PhotoUpload photos={photos} onChange={setPhotos} maxPhotos={4} />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-end">
            <button type="button" onClick={() => navigate('/buyer/orders')}
              className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className="flex items-center justify-center gap-2 bg-brand-pink text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-pink-dark transition-all shadow-sm shadow-pink-200 text-sm">
              <Send size={16} /> Anunciar Pedido
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
