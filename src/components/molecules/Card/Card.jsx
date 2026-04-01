export function Card({
  title,
  subtitle,
  icon: Icon,
  children,
  size = 'default',
  variant = 'default',
  className = '',
  interactive = false,
}) {
  const padding = {
    compact: 'p-4',
    default: 'p-6',
    large: 'p-8',
  };

  const variants_style = {
    default:
      'bg-white/[0.03] backdrop-blur-sm border border-white/10 shadow-sm',
    elevated:
      'bg-white/[0.05] backdrop-blur-md border border-white/15 shadow-lg shadow-white/5',
    accent:
      'bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/15 shadow-md',
    muted: 'bg-white/[0.02] border border-white/5',
  };

  const hoverClass = interactive
    ? 'hover:bg-white/[0.06] hover:border-white/20 hover:shadow-xl hover:shadow-white/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer'
    : 'hover:shadow-lg hover:border-white/15 transition-all duration-300';

  return (
    <div
      className={`${variants_style[variant]} rounded-2xl ${padding[size]} ${hoverClass} ${className}`}
    >
      {(title || Icon) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-white">{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm text-white/60 mt-1">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 ml-4">
              <Icon className="w-6 h-6 text-white/70" />
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}