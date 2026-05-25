import { useRef, useState } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import { compressImage } from '../utils/compressImage';

interface Props {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
  required?: boolean;
  error?: string;
}

export default function PhotoUpload({ photos, onChange, maxPhotos = 5, required = false, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const remaining = maxPhotos - photos.length;
    const toProcess = Array.from(files).slice(0, remaining);
    if (toProcess.length === 0) return;
    setLoading(true);
    try {
      const compressed = await Promise.all(toProcess.map(f => compressImage(f)));
      onChange([...photos, ...compressed]);
    } catch {
      // silently drop failed images
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = (idx: number) => {
    onChange(photos.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {photos.map((src, idx) => (
          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
            <img src={src} alt="" className="w-full h-full object-cover" />
            {idx === 0 && (
              <span className="absolute top-1 left-1 text-[9px] font-bold bg-brand-pink text-white px-1.5 py-0.5 rounded">
                Principal
              </span>
            )}
            <button
              type="button"
              onClick={() => remove(idx)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={11} />
            </button>
          </div>
        ))}

        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors ${
              error
                ? 'border-red-300 bg-red-50'
                : 'border-gray-200 bg-gray-50 hover:border-brand-pink hover:bg-pink-50'
            }`}
          >
            {loading ? (
              <Loader2 size={20} className="text-gray-400 animate-spin" />
            ) : (
              <>
                <Camera size={20} className={error ? 'text-red-400' : 'text-gray-400'} />
                <span className={`text-[10px] font-semibold ${error ? 'text-red-400' : 'text-gray-400'}`}>
                  Adicionar
                </span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />

      <div className="flex items-center justify-between mt-1.5">
        <div>
          {error ? (
            <p className="text-xs text-red-500">{error}</p>
          ) : required ? (
            <p className="text-xs text-gray-400">Mínimo 1 foto obrigatória</p>
          ) : (
            <p className="text-xs text-gray-400">Opcional — até {maxPhotos} fotos</p>
          )}
        </div>
        <p className="text-xs text-gray-400">{photos.length}/{maxPhotos}</p>
      </div>
    </div>
  );
}
