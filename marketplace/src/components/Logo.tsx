interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  textColor?: string;
}

export default function Logo({ size = 'md' }: LogoProps) {
  const h = { sm: 32, md: 42, lg: 64 }[size];

  return (
    <img
      src="/logo.jpg"
      alt="Mercari"
      height={h}
      style={{ height: h, width: 'auto', display: 'block' }}
    />
  );
}
