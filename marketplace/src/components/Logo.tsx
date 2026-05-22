interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  textColor?: string;
}

export default function Logo({ size = 'md', textColor }: LogoProps) {
  const cfg = {
    sm: { w: 28, h: 28, text: 'text-lg font-bold' },
    md: { w: 36, h: 36, text: 'text-xl font-bold' },
    lg: { w: 56, h: 56, text: 'text-3xl font-bold' },
  }[size];

  return (
    <div className="flex items-center gap-2">
      <svg width={cfg.w} height={cfg.h} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pink figure (left) */}
        <circle cx="18" cy="11" r="8" fill="#FF006E" />
        <path d="M4 44 C4 30 10 21 18 21 C26 21 31 30 31 40 C31 50 25 57 18 58 C11 57 4 50 4 44Z" fill="#FF006E" />
        {/* Blue figure (right) */}
        <circle cx="42" cy="11" r="8" fill="#00B4D8" />
        <path d="M56 44 C56 30 50 21 42 21 C34 21 29 30 29 40 C29 50 35 57 42 58 C49 57 56 50 56 44Z" fill="#00B4D8" />
        {/* Overlap gradient blend in center */}
        <ellipse cx="30" cy="40" rx="4" ry="10" fill="url(#overlap)" opacity="0.5" />
        <defs>
          <linearGradient id="overlap" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF006E" />
            <stop offset="100%" stopColor="#00B4D8" />
          </linearGradient>
        </defs>
      </svg>
      <span className={`${cfg.text} ${textColor ?? 'text-brand-pink'}`}>Mercari</span>
    </div>
  );
}
