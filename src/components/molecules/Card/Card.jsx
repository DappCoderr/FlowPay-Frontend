/**
 * Molecule: Card container. Optional title. size: default (p-6) | compact (p-4).
 */
export function Card({ title, children, size = 'default', className = '' }) {
  const padding = size === 'compact' ? 'p-4' : 'p-6'
  return (
    <div className={`bg-white/5 border border-white/10 rounded-lg ${padding} ${className}`}>
      {title && <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>}
      {children}
    </div>
  )
}
