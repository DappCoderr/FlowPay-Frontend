export function Button({
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    default: 'px-6 py-3 text-base',
    sm: 'px-3 py-1.5 text-sm',
    lg: 'px-8 py-4 text-lg',
  };

  const variants = {
    primary: 'bg-white text-black hover:bg-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md font-semibold',
    secondary: 'border border-white/30 text-white bg-white/5 hover:bg-white/15 hover:border-white/50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
    ghost: 'border border-white/20 text-white bg-transparent hover:bg-white/10 hover:border-white/40 hover:shadow-sm hover:-translate-y-0.5',
    outline: 'border border-white/30 text-white hover:bg-white/8 hover:border-white/40 hover:shadow-sm hover:-translate-y-0.5',
    danger: 'bg-red-600 text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md font-semibold',
    icon: 'p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 hover:shadow-sm',
  };

  const sizeClasses = variant === 'icon' ? '' : sizes[size] || sizes.default;

  return (
    <button
      type={type}
      className={`${base} ${sizeClasses} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
