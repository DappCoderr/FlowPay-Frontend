/**
 * Atom: Button. Variants for primary, secondary, ghost.
 */
export function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition disabled:opacity-50'
  const variants = {
    primary: 'px-6 py-3 bg-white text-black hover:bg-white/90',
    secondary: 'px-6 py-3 border border-white/30 text-white hover:bg-white/10',
    ghost: 'px-3 py-1.5 border border-white/20 text-white hover:bg-white/10',
    icon: 'p-2 rounded-lg hover:bg-white/10',
  }
  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
