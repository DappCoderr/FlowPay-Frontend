/**
 * Premium Button Component
 * - Multiple variants with smooth transitions
 * - Proper hover/active states
 * - Accessibility support
 * - Loading states
 */

export function Button({
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  type = 'button',
  isLoading = false,
  disabled = false,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black';

  const sizes = {
    default: 'px-6 py-3 text-base',
    sm: 'px-3 py-1.5 text-sm',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-lg',
  };

  const variants = {
    primary:
      'bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-50 hover:to-white hover:shadow-xl hover:shadow-white/20 hover:-translate-y-1 active:translate-y-0 active:shadow-lg font-semibold',
    secondary:
      'border border-white/40 text-white bg-white/5 backdrop-blur-sm hover:bg-white/15 hover:border-white/60 hover:shadow-xl hover:shadow-white/10 hover:-translate-y-1 active:translate-y-0',
    ghost:
      'border border-white/20 text-white bg-transparent hover:bg-white/10 hover:border-white/40 hover:shadow-lg hover:shadow-white/5 hover:-translate-y-0.5 active:translate-y-0',
    outline:
      'border border-white/30 text-white hover:bg-white/8 hover:border-white/50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
    danger:
      'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-1 active:translate-y-0 font-semibold',
    success:
      'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-1 active:translate-y-0 font-semibold',
    icon: 'p-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 hover:shadow-md focus:ring-1',
  };

  const sizeClasses = variant === 'icon' ? '' : sizes[size] || sizes.default;

  return (
    <button
      type={type}
      className={`${base} ${sizeClasses} ${variants[variant] || variants.primary} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}