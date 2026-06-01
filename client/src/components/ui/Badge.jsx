const variantStyles = {
  purple: 'bg-glow/10 text-glow',
  green: 'bg-green-500/10 text-green-600',
  red: 'bg-red-500/10 text-red-600',
  gray: 'bg-highlight/10 text-secondary'
};

export default function Badge({ children, variant = 'gray', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
