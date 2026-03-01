/**
 * Molecule: Icon + label text.
 */
export function IconLabel({ icon: Icon, children, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Icon && <Icon className="w-5 h-5 text-white/80 shrink-0" />}
      <span className="text-sm">{children}</span>
    </div>
  )
}
