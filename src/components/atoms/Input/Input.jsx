export function Input({
  label,
  id,
  type = 'text',
  className = '',
  error,
  ...props
}) {
  const inputId = id || props.name;
  const inputClasses = `w-full px-4 py-2.5 bg-white/5 border rounded-lg text-white placeholder-white/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white/8 ${
    error ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50' : 'border-white/20 focus:ring-cyan-400/30 focus:border-white/40'
  } ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-white/80 mb-2"
        >
          {label}
        </label>
      )}
      <input id={inputId} type={type} className={inputClasses} {...props} />
      {error && <p className="mt-1.5 text-xs text-red-400 font-medium">{error}</p>}
    </div>
  );
}
