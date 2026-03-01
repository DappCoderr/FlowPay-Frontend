/**
 * Atom: Text input. Supports label via composition or standalone.
 */
export function Input({
  label,
  id,
  type = 'text',
  className = '',
  error,
  ...props
}) {
  const inputId = id || props.name
  const inputClasses = `w-full px-3 py-2 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 ${
    error ? 'border-red-500/50' : 'border-white/20'
  } ${className}`

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-white/80 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={inputClasses}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
